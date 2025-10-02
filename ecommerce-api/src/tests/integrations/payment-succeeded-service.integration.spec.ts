import { prisma } from "@/configs/prisma.js";
import { stripe } from "@/configs/stripe.js";
import { IPaymentsRepository } from "@/models/repositories/interfaces/payments-repository.interface.js";
import { PrismaPaymentsRepository } from "@/models/repositories/prisma/payments-repository.prisma.js";
import { PaymentSucceededService } from "@/services/payments/payment-succeeded.service.js";
import { Decimal } from "@prisma/client/runtime/library";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let paymentsRepository: IPaymentsRepository;
let sut: PaymentSucceededService;

describe("Payment Succeeded Service (Integration)", () => {
  beforeEach(() => {
    paymentsRepository = new PrismaPaymentsRepository();
    sut = new PaymentSucceededService(paymentsRepository);

    vi.mock("stripe", () => {
      return {
        default: vi.fn().mockImplementation(() => ({
          charges: {
            retrieve: vi.fn().mockResolvedValue({
              id: "ch_123",
              status: "succeeded",
            }),
          },
          paymentIntents: {
            create: vi.fn().mockResolvedValue({
              id: "pi_123",
            }),
          },
        })),
      };
    });
  });

  afterEach(async () => {
    await prisma.payment.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should be able to create a payment intent", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: await hash("123456", 6),
      },
    });

    const cart = await prisma.cart.create({
      data: {
        user_id: user.id,
        status: "COMPLETED",
      },
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 119.9 * 100,
      currency: "brl",
      payment_method_types: ["card"],
    });

    await paymentsRepository.create({
      user_id: user.id,
      cart_id: cart.id,
      payment_method: "CREDIT_CARD",
      status: "PENDING",
      amount: new Decimal(119.9),
      transaction_id: paymentIntent.id,
    });

    paymentIntent.latest_charge = "ch_123";

    const response = await sut.execute({
      intent: paymentIntent,
    });

    expect(response.payment).toEqual(
      expect.objectContaining({
        status: "APPROVED",
        transaction_id: paymentIntent.latest_charge,
      }),
    );
  });
});
