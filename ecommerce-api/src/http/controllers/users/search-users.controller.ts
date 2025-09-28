import { makeSearchUsersService } from "@/services/users/factories/make-search-users.factory.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function searchUsers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchUsersQuerySchema = z.object({
    query: z.string().default(""),
    page: z.coerce.number().default(1),
  });

  const { query, page } = searchUsersQuerySchema.parse(request.query);

  try {
    const searchUsersService = makeSearchUsersService();

    const { users } = await searchUsersService.execute({
      query,
      page,
    });

    return reply.status(200).send({ users });
  } catch (err) {
    throw err;
  }
}
