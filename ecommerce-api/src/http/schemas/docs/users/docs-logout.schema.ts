import z from "zod";

export const logoutSchema = {
  tags: ["users"],
  description: "User to logout a session",
  security: [{ bearerAuth: [] }],
  response: {
    204: z.null().describe("Logout session."),
  },
};
