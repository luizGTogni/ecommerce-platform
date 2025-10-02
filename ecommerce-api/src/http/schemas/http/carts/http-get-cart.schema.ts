import z from "zod";

export const getCartParams = z.object({
  cartId: z.uuid(),
});

export const getCartResponseSuccessSchema = z.object({
  total_price: z.coerce.number(),
  total_products: z.coerce.number(),
  cart: z.object({
    id: z.string(),
    user_id: z.string(),
    status: z.string(),
    finished_at: z.date().nullable(),
    cart_items: z
      .array(
        z.object({
          id: z.string(),
          unit_price: z.coerce.number(),
          quantity: z.coerce.number(),
          product: z.object({
            id: z.string(),
            title: z.string(),
            category: z.string(),
            price: z.coerce.number(),
            quantity: z.coerce.number(),
          }),
        }),
      )
      .optional(),
  }),
});
