import { makeCreateUserService } from "@/services/users/factories/make-create.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = createUserBodySchema.parse(request.body);

  try {
    const useCase = makeCreateUserService();

    const { user } = await useCase.execute({ name, email, password });

    return reply.status(201).send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    throw err;
  }
}
