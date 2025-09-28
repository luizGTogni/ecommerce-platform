import z from "zod";

export const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const authenticateResponseSuccessSchema = z.object({
  token: z.string(),
});
