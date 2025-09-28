import z from "zod";

export const editUserBodySchema = z.object({
  name: z.string(),
  email: z.email(),
});

export const editUserResponseSuccessSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    created_at: z.date(),
  }),
});
