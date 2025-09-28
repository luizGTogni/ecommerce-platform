import z from "zod";

export const refreshTokenResponseSuccessSchema = z.object({
  token: z.string(),
});
