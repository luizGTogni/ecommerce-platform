import z from "zod";

export const searchProductsQuerySchema = z.object({
  query: z.string().default(""),
  includeInactive: z.boolean().default(false),
  page: z.coerce.number().default(1),
});

export const searchProductsResponseSuccessSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      category: z.string(),
      price: z.number(),
      quantity: z.number(),
      is_active: z.boolean(),
    }),
  ),
});
