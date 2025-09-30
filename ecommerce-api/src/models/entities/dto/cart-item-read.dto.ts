import type { Product } from "../product.entity.js";

export type CartItemRead = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
};
