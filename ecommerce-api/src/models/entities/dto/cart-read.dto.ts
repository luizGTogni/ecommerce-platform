import type { CartStatus } from "../cart.entity.js";

export type CartToCartItemsRead = {
  id: string;
  unit_price: number;
  quantity: number;
  product: {
    id: string;
    category: string;
    title: string;
    price: number;
    quantity: number;
  };
};

export type CartRead = {
  id: string;
  user_id: string;
  status: CartStatus;
  finished_at: Date | null;
  created_at: Date;
  cart_items?: CartToCartItemsRead[];
};
