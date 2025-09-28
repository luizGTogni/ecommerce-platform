import { createUserBodySchema } from "@/http/schemas/http/users/http-create.schema.js";
import { makeCreateUserService } from "@/services/users/factories/make-create.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = createUserBodySchema.parse(request.body);

  try {
    const useCase = makeCreateUserService();

    const { user } = await useCase.execute({ name, email, password });

    return reply.status(201).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    });
  } catch (err) {
    throw err;
  }
}
