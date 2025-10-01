import z from "zod";

export const addProductToCartBodySchema = z.object({
  quantity: z.number().min(1),
});

export const addProductToCartParams = z.object({
  productId: z.uuid(),
});
