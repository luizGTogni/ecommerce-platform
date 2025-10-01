import {
  updateProductToCartBodySchema,
  updateProductToCartParams,
} from "@/http/schemas/http/carts/http-update-product-to-cart.schema.js";
import { makeUpdateCartItemService } from "@/services/carts/factories/make-update-cart-item-service.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function updateProductToCart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { cartItemId } = updateProductToCartParams.parse(request.params);
  const { quantity } = updateProductToCartBodySchema.parse(request.body);

  try {
    const updateCartItemService = makeUpdateCartItemService();

    const { cartItem } = await updateCartItemService.execute({
      userId: request.user.sub,
      cartItemId,
      quantity,
    });

    return reply.status(200).send({ item: cartItem });
  } catch (err) {
    throw err;
  }
}
