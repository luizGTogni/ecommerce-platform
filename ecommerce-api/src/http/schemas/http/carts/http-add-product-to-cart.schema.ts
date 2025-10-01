import z from "zod";

export const addProductToCartBodySchema = z.object({
  quantity: z.number().min(1),
  productId: z.uuid(),
});
