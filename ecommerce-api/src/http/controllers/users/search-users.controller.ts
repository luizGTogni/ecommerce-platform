import { searchUsersQuerySchema } from "@/http/schemas/http/users/http-search-users.schema.js";
import { makeSearchUsersService } from "@/services/users/factories/make-search-users.factory.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function searchUsers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { query, page } = searchUsersQuerySchema.parse(request.query);

  try {
    const searchUsersService = makeSearchUsersService();

    const { users } = await searchUsersService.execute({
      query,
      page,
    });

    const usersMapped = users.map((user) => {
      return { ...user, password_hash: undefined };
    });

    return reply.status(200).send({ users: usersMapped });
  } catch (err) {
    throw err;
  }
}
