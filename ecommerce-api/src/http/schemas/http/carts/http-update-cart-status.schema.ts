import z from "zod";

export const updateCartStatusBodySchema = z.object({
  newStatus: z.enum(["OPEN", "CANCELED", "COMPLETED"]),
});

export const updateCartStatusParams = z.object({
  cartId: z.uuid(),
});
