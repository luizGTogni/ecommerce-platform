import z from "zod";
import {
  updateCartStatusBodySchema,
  updateCartStatusParams,
} from "../../http/carts/http-update-cart-status.schema.js";

export const updateCartStatusSchema = {
  tags: ["carts"],
  description: "Update the cart status",
  security: [{ bearerAuth: [] }],
  params: updateCartStatusParams,
  body: updateCartStatusBodySchema,
  response: {
    204: z.null(),
  },
};
