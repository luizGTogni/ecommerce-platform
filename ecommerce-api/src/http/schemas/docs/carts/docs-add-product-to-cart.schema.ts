import z from "zod";
import {
  addProductToCartBodySchema,
  addProductToCartParams,
} from "../../http/carts/http-add-product-to-cart.schema.js";

export const addProductToCartSchema = {
  tags: ["carts"],
  description: "Add product to cart",
  security: [{ bearerAuth: [] }],
  params: addProductToCartParams,
  body: addProductToCartBodySchema,
  response: {
    201: z.null(),
  },
};
