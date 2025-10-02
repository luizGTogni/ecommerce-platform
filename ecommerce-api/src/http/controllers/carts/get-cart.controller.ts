import { getCartParams } from "@/http/schemas/http/carts/http-get-cart.schema.js";
import { makeGetCartService } from "@/services/carts/factories/make-get-cart-service.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getCart(request: FastifyRequest, reply: FastifyReply) {
  const { cartId } = getCartParams.parse(request.params);

  try {
    const service = makeGetCartService();

    const { cart, total_price, total_products } = await service.execute({
      userId: request.user.sub,
      cartId,
    });

    return reply.status(200).send({ total_price, total_products, cart });
  } catch (err) {
    throw err;
  }
}
