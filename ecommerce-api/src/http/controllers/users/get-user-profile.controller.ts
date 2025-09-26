import { makeGetUserProfileService } from "@/services/users/factories/make-get-user-profile.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileService = makeGetUserProfileService();

  const { user } = await getUserProfileService.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
