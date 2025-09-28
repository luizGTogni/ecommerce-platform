import {
  editUserBodySchema,
  editUserResponseSuccessSchema,
} from "../../http/users/http-edit.schema.js";

export const editUserSchema = {
  tags: ["users"],
  description: "Edit a user (name and email)",
  security: [{ bearerAuth: [] }],
  body: editUserBodySchema,
  response: {
    200: editUserResponseSuccessSchema,
  },
};
