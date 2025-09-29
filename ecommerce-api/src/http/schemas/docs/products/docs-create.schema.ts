import {
  createProductBodySchema,
  createProductResponseSuccessSchema,
} from "../../http/products/http-create.schema.js";

export const createProductSchema = {
  tags: ["products"],
  description: "Create a product",
  security: [{ bearerAuth: [] }],
  body: createProductBodySchema,
  response: {
    201: createProductResponseSuccessSchema,
  },
};
