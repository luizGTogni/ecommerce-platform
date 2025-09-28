import {
  authenticateBodySchema,
  authenticateResponseSuccessSchema,
} from "../../http/users/http-authenticate.schema.js";

export const authenticateSchema = {
  tags: ["users"],
  description: "Authenticate a session",
  body: authenticateBodySchema,
  response: {
    200: authenticateResponseSuccessSchema,
  },
};
