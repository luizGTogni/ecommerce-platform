import z from "zod";

import { removeProductToCartParams } from "../../http/carts/http-remove-product-to-cart.schema.js";

export const removeProductToCartSchema = {
  tags: ["carts"],
  description: "Remove product to cart",
  security: [{ bearerAuth: [] }],
  params: removeProductToCartParams,
  response: {
    204: z.null(),
  },
};
