import { createProduct } from "../controllers/products/create.controller.js";
import { editProduct } from "../controllers/products/edit.controller.js";

import type { FastifyTypeInstance } from "../interfaces/fastify-types.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
import { createProductSchema } from "../schemas/docs/products/docs-create.schema.js";
import { editProductBodySchema } from "../schemas/http/products/http-edit.schema.js";

export async function productsRoutes(app: FastifyTypeInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/products", { schema: createProductSchema }, createProduct);
  app.put(
    "/products/:productId",
    { schema: editProductBodySchema },
    editProduct,
  );
}
