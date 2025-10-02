import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IPaymentsRepository } from "@/models/repositories/interfaces/payments-repository.interface.js";
import Stripe from "stripe";
import { PaymentRead } from "@/models/entities/dto/payment-read.dto.js";
import { stripe } from "@/configs/stripe.js";

type PaymentSucceedeRequest = {
  intent: Stripe.PaymentIntent;
};

type PaymentSucceedeResponse = {
  payment: PaymentRead;
};

export class PaymentSucceededService {
  constructor(private readonly paymentsRepository: IPaymentsRepository) {}

  async execute({
    intent,
  }: PaymentSucceedeRequest): Promise<PaymentSucceedeResponse> {
    const payment = await this.paymentsRepository.findByStripeIntentId(
      intent.id,
    );

    if (!payment) {
      throw new ResourceNotFoundError();
    }

    const charge = await stripe.charges.retrieve(
      intent.latest_charge as string,
    );

    payment.status = "APPROVED";
    payment.paid_at = new Date();
    payment.transaction_id = charge.id;

    await this.paymentsRepository.save(payment.id, payment);

    return {
      payment: {
        ...payment,
        amount: payment.amount.toNumber(),
      },
    };
  }
}
