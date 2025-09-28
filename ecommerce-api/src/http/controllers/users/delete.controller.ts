import { makeDeleteUserService } from "@/services/users/factories/make-delete-user.factory.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const deleteUserService = makeDeleteUserService();

    await deleteUserService.execute({
      userId: request.user.sub,
    });

    return reply.status(204).send({ message: "User deleted successfully." });
  } catch (err) {
    throw err;
  }
}
