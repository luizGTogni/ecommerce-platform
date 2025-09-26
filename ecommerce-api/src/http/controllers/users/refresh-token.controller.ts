import { makeGetSessionService } from "@/services/sessions/factories/make-get-session.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true });

  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    return reply.status(401).send({ message: "Unauthorized." });
  }

  const getSessionService = makeGetSessionService();

  await getSessionService.execute({
    userId: request.user.sub,
    refreshToken,
  });

  try {
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: request.user.sub,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},
      { sign: { sub: request.user.sub, expiresIn: "7d" } },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (err) {
    throw err;
  }
}
