import { Decimal } from "@prisma/client/runtime/library";

export type CartStatus = "OPEN" | "CANCELED" | "COMPLETED";

export type CartToCartItems = {
  id: string;
  unit_price: Decimal;
  quantity: number;
  product: {
    id: string;
    category: string;
    title: string;
    price: Decimal;
    quantity: number;
  };
};
export type Cart = {
  id: string;
  user_id: string;
  status: CartStatus;
  finished_at: Date | null;
  created_at: Date;
  cart_items?: CartToCartItems[];
};
