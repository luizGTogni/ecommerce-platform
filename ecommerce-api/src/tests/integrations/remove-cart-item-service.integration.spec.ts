import { prisma } from "@/configs/prisma.js";
import { CartAlreadyFinishedError } from "@/errors/cart-already-finished.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { ICartItemsRepository } from "@/models/repositories/interfaces/cart-items-repository.interface.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaCartItemsRepository } from "@/models/repositories/prisma/cart-items-repository.prisma.js";
import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { RemoveCartItemService } from "@/services/carts/remove-cart-item.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let cartItemsRepository: ICartItemsRepository;
let cartsRepository: ICartsRepository;
let usersRepository: IUsersRepository;
let sut: RemoveCartItemService;

describe("Remove Cart Item Service (Integration)", () => {
  beforeEach(() => {
    cartItemsRepository = new PrismaCartItemsRepository();
    cartsRepository = new PrismaCartsRepository();
    usersRepository = new PrismaUsersRepository();
    sut = new RemoveCartItemService(
      cartItemsRepository,
      cartsRepository,
      usersRepository,
    );
  });

  afterEach(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should be able to remove a cart item", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const product = await prisma.product.create({
      data: {
        title: "Product 1",
        description: null,
        category: "Product Category 1",
        price: 58.95,
        quantity: 2,
        is_active: true,
      },
    });

    const cartItem = await cartItemsRepository.create({
      cart_id: cart.id,
      product_id: product.id,
      quantity: 2,
      unit_price: product.price,
    });

    await sut.execute({
      userId: user.id,
      cartItemId: cartItem.id,
    });

    const cartItemFounded = await prisma.cartItem.findFirst();

    expect(cartItemFounded).toEqual(null);
  });

  it("should not be able to remove a cart item if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        cartItemId: "cart-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to remove a cart item if owner cart not same userId", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const user2 = await usersRepository.create({
      name: "Michael Doe",
      email: "michael@example.com",
      password_hash: await hash("123456", 6),
    });

    const product = await prisma.product.create({
      data: {
        title: "Product 1",
        description: null,
        category: "Product Category 1",
        price: 58.95,
        quantity: 2,
        is_active: true,
      },
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const cartItem = await cartItemsRepository.create({
      cart_id: cart.id,
      product_id: product.id,
      quantity: 2,
      unit_price: product.price,
    });

    await expect(() =>
      sut.execute({
        userId: user2.id,
        cartItemId: cartItem.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to remove a cart item if cart status canceled or completed", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const product = await prisma.product.create({
      data: {
        title: "Product 1",
        description: null,
        category: "Product Category 1",
        price: 58.95,
        quantity: 2,
        is_active: true,
      },
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "CANCELED",
    });

    const cartItem = await cartItemsRepository.create({
      cart_id: cart.id,
      product_id: product.id,
      quantity: 2,
      unit_price: product.price,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartItemId: cartItem.id,
      }),
    ).rejects.toBeInstanceOf(CartAlreadyFinishedError);
  });
});
