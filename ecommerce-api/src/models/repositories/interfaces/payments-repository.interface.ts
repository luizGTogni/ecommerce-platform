import { PaymentCreate } from "@/models/entities/dto/payment-create.dto.js";
import { Payment } from "@/models/entities/payment.entity.js";

export interface IPaymentsRepository {
  create(data: PaymentCreate): Promise<Payment>;
}
