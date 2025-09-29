export type Product = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  quantity: number;
  is_active: boolean;
};
