import { authenticateBodySchema } from "@/http/schemas/http/users/http-authenticate.schema.js";
import { makeSaveRefreshTokenService } from "@/services/sessions/factories/make-save-refresh-token.factory.js";
import { makeAuthenticateService } from "@/services/users/factories/make-authenticate.factory.js";
import dayjs from "dayjs";

import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateService();
    const saveRefreshToken = makeSaveRefreshTokenService();

    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},
      { sign: { sub: user.id, expiresIn: "7d" } },
    );

    await saveRefreshToken.execute({
      userId: user.id,
      refreshToken: refreshToken,
      expiresAt: dayjs().add(7, "day").toDate(),
    });

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
