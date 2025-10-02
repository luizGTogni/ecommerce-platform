import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IPaymentsRepository } from "@/models/repositories/interfaces/payments-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { Decimal } from "@prisma/client/runtime/library";
import { PaymentMethod } from "@/models/entities/payment.entity.js";
import { stripe } from "@/configs/stripe.js";

type CreatePaymentIntentRequest = {
  userId: string;
  cartId: string;
  amount: Decimal;
  paymentMethod: PaymentMethod;
};

type CreatePaymentIntentResponse = {
  client_secret: string;
};

enum PaymentMethodStripe {
  CREDIT_CARD = "card",
  PIX = "pix",
  BOLETO = "boleto",
  PAYPAL = "paypal",
}

export class CreatePaymentIntentService {
  constructor(
    private readonly paymentsRepository: IPaymentsRepository,
    private readonly usersRepository: IUsersRepository,
    private readonly cartsRepository: ICartsRepository,
  ) {}

  async execute({
    userId,
    cartId,
    amount,
    paymentMethod,
  }: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const cart = await this.cartsRepository.findById(cartId);

    if (!cart) {
      throw new ResourceNotFoundError();
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount.toNumber(),
      currency: "brl",
      payment_method_types: [PaymentMethodStripe[paymentMethod]],
    });

    await this.paymentsRepository.create({
      user_id: userId,
      cart_id: cartId,
      transaction_id: paymentIntent.id,
      amount,
      payment_method: paymentMethod,
      status: "PENDING",
    });

    if (!paymentIntent.client_secret) {
      throw new ResourceNotFoundError();
    }

    return {
      client_secret: paymentIntent.client_secret,
    };
  }
}
