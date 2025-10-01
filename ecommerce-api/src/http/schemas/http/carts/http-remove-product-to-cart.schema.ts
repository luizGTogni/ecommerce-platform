import z from "zod";

export const removeProductToCartParams = z.object({
  cartItemId: z.uuid(),
});
