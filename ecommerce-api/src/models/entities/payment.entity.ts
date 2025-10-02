import { Decimal } from "@prisma/client/runtime/library";

export type PaymentStatus = "PENDING" | "APPROVED" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CREDIT_CARD" | "PIX" | "BOLETO" | "PAYPAL";

export type Payment = {
  id: string;
  user_id: string;
  cart_id: string;
  transaction_id: string;
  payment_method: PaymentMethod;
  amount: Decimal;
  status: PaymentStatus;
  paid_at: Date | null;
  refunded_at: Date | null;
  created_at: Date;
  updated_at: Date;
};
