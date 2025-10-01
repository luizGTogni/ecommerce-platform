import z from "zod";

export const updateProductToCartBodySchema = z.object({
  quantity: z.number().min(1),
});

export const updateProductToCartParams = z.object({
  cartItemId: z.uuid(),
});

export const updateProductToCartResponseSuccessSchema = z.object({
  item: z.object({
    id: z.string(),
    cart_id: z.string(),
    product_id: z.string(),
    quantity: z.coerce.number(),
    unit_price: z.coerce.number(),
    product: z
      .object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        category: z.string(),
        price: z.coerce.number(),
        quantity: z.coerce.number(),
        is_active: z.boolean(),
      })
      .optional(),
  }),
});
