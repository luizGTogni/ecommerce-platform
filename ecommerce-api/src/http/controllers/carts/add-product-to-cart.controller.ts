import {
  addProductToCartBodySchema,
  addProductToCartParams,
} from "@/http/schemas/http/carts/http-add-product-to-cart.schema.js";
import { makeAddCartItemService } from "@/services/carts/factories/make-add-cart-item-service.factory.js";
import { makeCreateCartService } from "@/services/carts/factories/make-create-cart-service.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function addProductToCart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { productId } = addProductToCartParams.parse(request.params);
  const { quantity } = addProductToCartBodySchema.parse(request.body);

  try {
    const addCreateCartService = makeCreateCartService();

    const { cart } = await addCreateCartService.execute({
      userId: request.user.sub,
    });

    const addCartItemService = makeAddCartItemService();

    await addCartItemService.execute({
      userId: request.user.sub,
      cartId: cart.id,
      productId,
      quantity,
    });

    return reply.status(201).send();
  } catch (err) {
    throw err;
  }
}
