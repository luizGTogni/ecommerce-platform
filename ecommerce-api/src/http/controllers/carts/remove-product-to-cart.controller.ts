import { removeProductToCartParams } from "@/http/schemas/http/carts/http-remove-product-to-cart.schema.js";
import { makeRemoveCartItemService } from "@/services/carts/factories/make-remove-cart-item-service.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function removeProductToCart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { cartItemId } = removeProductToCartParams.parse(request.params);

  try {
    const removeCartItemService = makeRemoveCartItemService();

    await removeCartItemService.execute({
      userId: request.user.sub,
      cartItemId,
    });

    return reply.status(204).send();
  } catch (err) {
    throw err;
  }
}
