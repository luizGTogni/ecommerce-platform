import { createProductBodySchema } from "@/http/schemas/http/products/http-create.schema.js";
import { makeCreateProductService } from "@/services/products/factories/make-create-service.factory.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { title, description, category, price, quantity, is_active } =
    createProductBodySchema.parse(request.body);

  try {
    const service = makeCreateProductService();

    const { product } = await service.execute({
      title,
      description,
      category,
      price,
      quantity,
      is_active,
    });

    return reply.status(201).send({
      product,
    });
  } catch (err) {
    throw err;
  }
}
