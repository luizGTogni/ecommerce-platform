import {
  updateProductToCartBodySchema,
  updateProductToCartParams,
  updateProductToCartResponseSuccessSchema,
} from "../../http/carts/http-update-product-to-cart.schema.js";

export const updateProductToCartSchema = {
  tags: ["carts"],
  description: "Update product to cart",
  security: [{ bearerAuth: [] }],
  params: updateProductToCartParams,
  body: updateProductToCartBodySchema,
  response: {
    200: updateProductToCartResponseSuccessSchema,
  },
};
