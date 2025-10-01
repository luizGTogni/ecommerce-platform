import {
  updateCartStatusBodySchema,
  updateCartStatusParams,
} from "@/http/schemas/http/carts/http-update-cart-status.schema.js";
import { makeUpdateStatusCartService } from "@/services/carts/factories/make-update-status-cart-service.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function updateCartStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { cartId } = updateCartStatusParams.parse(request.params);
  const { newStatus } = updateCartStatusBodySchema.parse(request.body);

  try {
    const updateStatusCartService = makeUpdateStatusCartService();

    await updateStatusCartService.execute({
      userId: request.user.sub,
      cartId,
      newStatus,
    });

    return reply.status(204).send();
  } catch (err) {
    throw err;
  }
}
