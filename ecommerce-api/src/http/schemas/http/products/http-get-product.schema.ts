import z from "zod";

export const getProductParamsSchema = z.object({
  productId: z.uuid(),
});

export const getProductResponseSuccessSchema = z.object({
  product: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    price: z.number(),
    quantity: z.number(),
    is_active: z.boolean(),
  }),
});
