import { getProductParamsSchema } from "@/http/schemas/http/products/http-get-product.schema.js";
import { makeGetProductService } from "@/services/products/factories/make-get-product-service.factory.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const { productId } = getProductParamsSchema.parse(request.params);

  try {
    const service = makeGetProductService();

    const { product } = await service.execute({
      productId,
      hasViewerPermission: false,
    });

    return reply.status(200).send({
      product: {
        ...product,
        price: product.price.toNumber(),
      },
    });
  } catch (err) {
    throw err;
  }
}
