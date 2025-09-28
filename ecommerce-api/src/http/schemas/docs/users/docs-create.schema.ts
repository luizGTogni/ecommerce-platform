import {
  createUserBodySchema,
  createUserResponseSuccessSchema,
} from "../../http/users/http-create.schema.js";

export const createUserSchema = {
  tags: ["users"],
  description: "Create a user",
  body: createUserBodySchema,
  response: {
    201: createUserResponseSuccessSchema,
  },
};
