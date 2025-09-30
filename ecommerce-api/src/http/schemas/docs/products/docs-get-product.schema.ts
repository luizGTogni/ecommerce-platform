import {
  getProductParamsSchema,
  getProductResponseSuccessSchema,
} from "../../http/products/http-get-product.schema.js";

export const getProductSchema = {
  tags: ["products"],
  description: "Get product info",
  security: [{ bearerAuth: [] }],
  params: getProductParamsSchema,
  response: {
    200: getProductResponseSuccessSchema,
  },
};
