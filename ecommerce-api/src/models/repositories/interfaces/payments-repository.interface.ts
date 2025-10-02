import { PaymentCreate } from "@/models/entities/dto/payment-create.dto.js";
import { Payment } from "@/models/entities/payment.entity.js";

export interface IPaymentsRepository {
  create(data: PaymentCreate): Promise<Payment>;
  findByStripeIntentId(intent_id: string): Promise<Payment | null>;
  save(paymentId: string, payment: Payment): Promise<void>;
}
