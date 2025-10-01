import { prisma } from "@/configs/prisma.js";
import { CartAlreadyFinishedError } from "@/errors/cart-already-finished.error.js";
import { ProductOutOfStockError } from "@/errors/product-out-of-stock.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { ICartItemsRepository } from "@/models/repositories/interfaces/cart-items-repository.interface.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import type { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaCartItemsRepository } from "@/models/repositories/prisma/cart-items-repository.prisma.js";
import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { UpdateCartItemService } from "@/services/carts/update-cart-item.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let cartItemsRepository: ICartItemsRepository;
let cartsRepository: ICartsRepository;
let productsRepository: IProductsRepository;
let usersRepository: IUsersRepository;
let sut: UpdateCartItemService;

describe("Update Cart Item Service (Integration)", () => {
  beforeEach(() => {
    cartItemsRepository = new PrismaCartItemsRepository();
    cartsRepository = new PrismaCartsRepository();
    productsRepository = new PrismaProductsRepository();
    usersRepository = new PrismaUsersRepository();
    sut = new UpdateCartItemService(
      cartItemsRepository,
      cartsRepository,
      productsRepository,
      usersRepository,
    );
  });

  afterEach(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should be able to update a cart item", async () => {
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
        quantity: 4,
        is_active: true,
      },
    });

    const cartItem = await cartItemsRepository.create({
      cart_id: cart.id,
      product_id: product.id,
      quantity: 2,
      unit_price: product.price,
    });

    const response = await sut.execute({
      userId: user.id,
      cartItemId: cartItem.id,
      quantity: 3,
    });

    expect(response.cartItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        cart_id: cart.id,
        product_id: product.id,
        quantity: 3,
        unit_price: cartItem.unit_price.toNumber(),
      }),
    );
  });

  it("should not be able to update a cart item if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        cartItemId: "cartItem-id",
        quantity: 3,
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
        quantity: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update a cart item if cart status canceled or completed", async () => {
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
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(CartAlreadyFinishedError);
  });

  it("should not be able to update a cart item if quantity insufficient stock", async () => {
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
        quantity: 4,
        is_active: true,
      },
    });

    const cartItem = await cartItemsRepository.create({
      cart_id: cart.id,
      product_id: product.id,
      quantity: 8,
      unit_price: product.price,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartItemId: cartItem.id,
        quantity: 20,
      }),
    ).rejects.toBeInstanceOf(ProductOutOfStockError);
  });

  it("should not be able to update a cart item if product not active", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const product = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 10,
      is_active: false,
    });

    const cartItem = await cartItemsRepository.create({
      cart_id: cart.id,
      product_id: product.id,
      quantity: 8,
      unit_price: product.price,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartItemId: cartItem.id,
        quantity: 3,
      }),
    ).rejects.toBeInstanceOf(ProductOutOfStockError);
  });
});
