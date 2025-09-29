import {
  searchProductsResponseSuccessSchema,
  searchProductsQuerySchema,
} from "../../http/products/http-search-products.schema.js";

export const searchProductsSchema = {
  tags: ["products"],
  description: "Fetch products list",
  security: [{ bearerAuth: [] }],
  query: searchProductsQuerySchema,
  response: {
    200: searchProductsResponseSuccessSchema,
  },
};
