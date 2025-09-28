import z from "zod";

export const deleteUserSchema = {
  tags: ["users"],
  description: "Delete a user",
  security: [{ bearerAuth: [] }],
  response: {
    204: z.object({
      message: z.string(),
    }),
  },
};
