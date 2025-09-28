import z from "zod";

export const createUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

export const createUserResponseSuccessSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    created_at: z.date(),
  }),
});
