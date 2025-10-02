import { prisma } from "@/configs/prisma.js";
import { PaymentCreate } from "@/models/entities/dto/payment-create.dto.js";
import { IPaymentsRepository } from "../interfaces/payments-repository.interface.js";
import { Payment } from "@/models/entities/payment.entity.js";

export class PrismaPaymentsRepository implements IPaymentsRepository {
  async create(data: PaymentCreate) {
    return await prisma.payment.create({
      data: {
        ...data,
      },
    });
  }

  async findByStripeIntentId(intent_id: string) {
    return await prisma.payment.findFirst({
      where: {
        transaction_id: intent_id,
      },
    });
  }

  async save(paymentId: string, payment: Payment) {
    await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: payment,
    });
  }
}
