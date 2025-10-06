import { PaymentMethod, PaymentStatus } from "../payment.entity.js";

export type PaymentRead = {
  id: string;
  user_id: string;
  cart_id: string;
  transaction_id: string;
  payment_method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  paid_at: Date | null;
  refunded_at: Date | null;
  created_at: Date;
  updated_at: Date;
};
