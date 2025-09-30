import { Decimal } from "@prisma/client/runtime/library";

export type Product = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: Decimal;
  quantity: number;
  is_active: boolean;
};
