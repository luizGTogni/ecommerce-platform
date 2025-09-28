import { editUserBodySchema } from "@/http/schemas/http/users/http-edit.schema.js";
import { makeEditUserService } from "@/services/users/factories/make-edit-user.factory.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function editUser(request: FastifyRequest, reply: FastifyReply) {
  const { name, email } = editUserBodySchema.parse(request.body);

  try {
    const editUserService = makeEditUserService();

    const { user } = await editUserService.execute({
      userId: request.user.sub,
      name,
      email,
    });

    return reply.status(200).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    });
  } catch (err) {
    throw err;
  }
}
