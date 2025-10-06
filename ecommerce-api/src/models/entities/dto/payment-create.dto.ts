import { Decimal } from "@prisma/client/runtime/library";
import { PaymentMethod, PaymentStatus } from "../payment.entity.js";

export type PaymentCreate = {
  user_id: string;
  cart_id: string;
  transaction_id: string;
  payment_method: PaymentMethod;
  amount: Decimal;
  status: PaymentStatus;
};
