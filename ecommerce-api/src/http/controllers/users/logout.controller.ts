import { makeLogoutSessionService } from "@/services/sessions/factories/make-logout-session.factory.js";

import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  const logoutHeadersSchema = z.object({
    authorization: z.string(),
  });

  const { authorization } = logoutHeadersSchema.parse(request.headers);

  try {
    const logoutUseCase = makeLogoutSessionService();

    await logoutUseCase.execute({
      userId: request.user.sub,
      token: authorization.replace("Bearer ", ""),
    });

    return reply
      .setCookie("refreshToken", "", {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(204)
      .send();
  } catch (err) {
    throw err;
  }
}
