import { prisma } from "@/configs/prisma.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { GetCartService } from "@/services/carts/get-cart.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let cartsRepository: ICartsRepository;
let usersRepository: IUsersRepository;
let sut: GetCartService;

describe("Get Cart Service (Integration)", () => {
  beforeEach(() => {
    cartsRepository = new PrismaCartsRepository();
    usersRepository = new PrismaUsersRepository();
    sut = new GetCartService(cartsRepository, usersRepository);
  });

  afterEach(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should be able to get a cart", async () => {
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
        quantity: 6,
        is_active: true,
      },
    });

    const cartItem = await prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: product.id,
        quantity: 4,
        unit_price: product.price,
      },
    });

    const response = await sut.execute({
      userId: user.id,
      cartId: cart.id,
    });

    expect(response.total_price).toEqual(
      cartItem.unit_price.toNumber() * cartItem.quantity,
    );
    expect(response.total_products).toEqual(1);
    expect(response.cart).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        status: "OPEN",
        finished_at: null,
        cart_items: expect.arrayContaining([
          expect.objectContaining({
            id: cartItem.id,
            unit_price: cartItem.unit_price.toNumber(),
            quantity: cartItem.quantity,
            product: expect.objectContaining({
              id: product.id,
              title: product.title,
              category: product.category,
              price: product.price.toNumber(),
              quantity: product.quantity,
            }),
          }),
        ]),
      }),
    );
  });

  it("should not be able to get a cart if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        cartId: "cart-not-exists",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to get a cart if cart not exists", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartId: "cart-not-exists",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to get a cart if owner cart not same userId", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    await sut.execute({
      userId: user.id,
      cartId: cart.id,
    });

    const user2 = await usersRepository.create({
      name: "Michael Doe",
      email: "michaeldoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: user2.id,
        cartId: cart.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
