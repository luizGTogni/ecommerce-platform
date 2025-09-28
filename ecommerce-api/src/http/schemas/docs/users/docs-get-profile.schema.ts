import { getUserProfileResponseSuccessSchema } from "../../http/users/http-get-profile.schema.js";

export const getUserProfileSchema = {
  tags: ["users"],
  description: "Get a user profile",
  security: [{ bearerAuth: [] }],
  response: {
    200: getUserProfileResponseSuccessSchema,
  },
};
