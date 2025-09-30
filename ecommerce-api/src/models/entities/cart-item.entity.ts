import { Decimal } from "@prisma/client/runtime/library";
import { Product } from "./product.entity.js";

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: Decimal;
  product?: Product;
};
