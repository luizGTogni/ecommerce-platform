import { prisma } from "@/configs/prisma.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IPaymentsRepository } from "@/models/repositories/interfaces/payments-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaPaymentsRepository } from "@/models/repositories/prisma/payments-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { CreatePaymentIntentService } from "@/services/payments/create-payment-intent.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let paymentsRepository: IPaymentsRepository;
let cartsRepository: ICartsRepository;
let usersRepository: IUsersRepository;
let sut: CreatePaymentIntentService;

describe("Create Payment Intent Service (Integration)", () => {
  beforeEach(() => {
    paymentsRepository = new PrismaPaymentsRepository();
    cartsRepository = new PrismaCartsRepository();
    usersRepository = new PrismaUsersRepository();
    sut = new CreatePaymentIntentService(
      paymentsRepository,
      usersRepository,
      cartsRepository,
    );
  });

  afterEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should be able to create a payment intent", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "COMPLETED",
    });

    const product = await prisma.product.create({
      data: {
        title: "Product 1",
        description: null,
        category: "Product Category 1",
        price: 58.95,
        quantity: 3,
        is_active: true,
      },
    });

    await prisma.cartItem.create({
      data: {
        product_id: product.id,
        cart_id: cart.id,
        unit_price: product.price,
        quantity: 2,
      },
    });

    const response = await sut.execute({
      userId: user.id,
      cartId: cart.id,
      paymentMethod: "CREDIT_CARD",
    });

    expect(response.client_secret).toEqual(expect.any(String));
  });

  it("should not be able to create a payment intent if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        cartId: "cart-id",
        paymentMethod: "CREDIT_CARD",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create a payment intent if cart already exists", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartId: "cart-id",
        paymentMethod: "CREDIT_CARD",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
