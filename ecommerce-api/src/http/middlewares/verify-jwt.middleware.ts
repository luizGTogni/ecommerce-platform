import { makeVerifyIfRevokedTokenService } from "@/services/sessions/factories/make-verify-if-revoked-token.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();

    const tokenRequest = request.headers.authorization;

    if (!tokenRequest) {
      return reply.status(401).send({ message: "Unauthorized." });
    }

    const verifyIfRevokedList = makeVerifyIfRevokedTokenService();
    const { isRevoked } = await verifyIfRevokedList.execute({
      userId: request.user.sub,
      token: tokenRequest.replace("Bearer ", ""),
    });

    if (isRevoked) {
      return reply.status(401).send({ message: "Unauthorized." });
    }
  } catch {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}
