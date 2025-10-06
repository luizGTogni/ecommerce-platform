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

    const total_price = cart.cart_items
      ? cart.cart_items.reduce(
          (acc, item) => acc + item.unit_price.toNumber() * item.quantity,
          0,
        )
      : 0;

    console.log(PaymentMethodStripe[paymentMethod]);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total_price * 100,
      currency: "brl",
      payment_method: PaymentMethodStripe[paymentMethod],
    });

    await this.paymentsRepository.create({
      user_id: userId,
      cart_id: cartId,
      transaction_id: paymentIntent.id,
      amount: new Decimal(total_price),
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
