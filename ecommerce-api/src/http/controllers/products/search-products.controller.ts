import { searchProductsQuerySchema } from "@/http/schemas/http/products/http-search-products.schema.js";
import { makeSearchProductsService } from "@/services/products/factories/make-search-products-service.factory.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function searchProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { query, includeInactive, page } = searchProductsQuerySchema.parse(
    request.query,
  );

  try {
    const searchProductsService = makeSearchProductsService();

    const { products } = await searchProductsService.execute({
      query,
      includeInactive,
      page,
    });

    const productsMapped = products.map((product) => {
      return {
        ...product,
        price: product.price.toNumber(),
      };
    });

    return reply.status(200).send({ products: productsMapped });
  } catch (err) {
    throw err;
  }
}
