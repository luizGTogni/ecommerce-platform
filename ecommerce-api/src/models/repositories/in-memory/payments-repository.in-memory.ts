import { randomUUID } from "node:crypto";
import { IPaymentsRepository } from "../interfaces/payments-repository.interface.js";
import { Payment } from "@/models/entities/payment.entity.js";
import { PaymentCreate } from "@/models/entities/dto/payment-create.dto.js";

export class InMemoryPaymentsRepository implements IPaymentsRepository {
  private payments: Payment[] = [];

  async create(data: PaymentCreate) {
    const paymentCreated: Payment = {
      id: randomUUID(),
      ...data,
      paid_at: null,
      refunded_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.payments.push(paymentCreated);

    return paymentCreated;
  }

  async findByStripeIntentId(intent_id: string) {
    return (
      this.payments.find((payment) => payment.transaction_id === intent_id) ||
      null
    );
  }

  async save(paymentId: string, paymentEdited: Payment) {
    const paymentIndex = this.payments.findIndex(
      (payment) => payment.id === paymentId,
    );
    this.payments[paymentIndex] = paymentEdited;
  }
}
