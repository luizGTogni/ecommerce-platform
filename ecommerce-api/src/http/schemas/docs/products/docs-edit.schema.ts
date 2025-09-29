import {
  editProductBodySchema,
  editProductResponseSuccessSchema,
} from "../../http/products/http-edit.schema.js";

export const editProductSchema = {
  tags: ["products"],
  description: "Edit a product",
  security: [{ bearerAuth: [] }],
  body: editProductBodySchema,
  response: {
    200: editProductResponseSuccessSchema,
  },
};
