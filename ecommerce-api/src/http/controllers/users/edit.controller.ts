import { makeEditUserService } from "@/services/users/factories/make-edit-user.factory.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function editUser(request: FastifyRequest, reply: FastifyReply) {
  const editUserBodySchema = z.object({
    name: z.string(),
    email: z.email(),
  });

  const { name, email } = editUserBodySchema.parse(request.body);

  try {
    const editUserService = makeEditUserService();

    const { user } = await editUserService.execute({
      userId: request.user.sub,
      name,
      email,
    });

    return reply.status(200).send({
      user,
    });
  } catch (err) {
    throw err;
  }
}
