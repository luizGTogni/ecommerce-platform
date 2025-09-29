import z from "zod";

export const editProductBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number().min(0),
  quantity: z.number().min(0),
  is_active: z.boolean(),
});

export const editProductParamsSchema = z.object({
  productId: z.uuid(),
});

export const editProductResponseSuccessSchema = z.object({
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
