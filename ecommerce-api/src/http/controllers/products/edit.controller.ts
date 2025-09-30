import {
  editProductBodySchema,
  editProductParamsSchema,
} from "@/http/schemas/http/products/http-edit.schema.js";
import { makeEditProductService } from "@/services/products/factories/make-edit-service.factory.js";
import { Decimal } from "@prisma/client/runtime/library";
import { FastifyReply, FastifyRequest } from "fastify";

export async function editProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { title, description, category, price, quantity, is_active } =
    editProductBodySchema.parse(request.body);

  const { productId } = editProductParamsSchema.parse(request.params);

  try {
    const service = makeEditProductService();

    const { product } = await service.execute({
      productId,
      title,
      description,
      category,
      price,
      quantity,
      is_active,
    });

    return reply.status(200).send({
      product: {
        ...product,
        price: new Decimal(product.price).toNumber(),
      },
    });
  } catch (err) {
    throw err;
  }
}
