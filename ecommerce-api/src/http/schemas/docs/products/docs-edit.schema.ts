import {
  editProductBodySchema,
  editProductParamsSchema,
  editProductResponseSuccessSchema,
} from "../../http/products/http-edit.schema.js";

export const editProductSchema = {
  tags: ["products"],
  description: "Edit a product",
  security: [{ bearerAuth: [] }],
  params: editProductParamsSchema,
  body: editProductBodySchema,
  response: {
    200: editProductResponseSuccessSchema,
  },
};
