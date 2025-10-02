import { prisma } from "@/configs/prisma.js";
import { PaymentCreate } from "@/models/entities/dto/payment-create.dto.js";
import { IPaymentsRepository } from "../interfaces/payments-repository.interface.js";

export class PrismaPaymentsRepository implements IPaymentsRepository {
  async create(data: PaymentCreate) {
    return await prisma.payment.create({
      data: {
        ...data,
      },
    });
  }
}
