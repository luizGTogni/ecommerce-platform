import { refreshTokenResponseSuccessSchema } from "../../http/users/http-refresh-token.schema.js";

export const refreshTokenSchema = {
  tags: ["users"],
  description: "Refresh token for continue in session login",
  parameters: [
    {
      in: "cookie",
      name: "refresh_token",
      required: true,
      schema: { type: "string" },
      description: "Refresh token in cookie",
    },
  ],
  response: {
    200: refreshTokenResponseSuccessSchema,
  },
};
