import {
  getCartParams,
  getCartResponseSuccessSchema,
} from "../../http/carts/http-get-cart.schema.js";

export const getCartSchema = {
  tags: ["carts"],
  description: "get the cart",
  security: [{ bearerAuth: [] }],
  params: getCartParams,
  response: {
    200: getCartResponseSuccessSchema,
  },
};
