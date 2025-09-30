import { Decimal } from "@prisma/client/runtime/library";

export type CartItemEdited = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: Decimal;
};
