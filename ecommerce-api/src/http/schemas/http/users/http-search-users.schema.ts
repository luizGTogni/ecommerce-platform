import z from "zod";

export const searchUsersQuerySchema = z.object({
  query: z.string().default(""),
  page: z.coerce.number().default(1),
});

export const searchUsersResponseSuccessSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    created_at: z.date(),
  }),
);
