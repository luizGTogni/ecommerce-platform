import z from "zod";

export const getUserProfileResponseSuccessSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    created_at: z.date(),
  }),
});
