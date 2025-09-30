import { createProduct } from "../controllers/products/create.controller.js";
import { editProduct } from "../controllers/products/edit.controller.js";
import { getProduct } from "../controllers/products/get-product.controller.js";
import { searchProducts } from "../controllers/products/search-products.controller.js";

import type { FastifyTypeInstance } from "../interfaces/fastify-types.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
import { createProductSchema } from "../schemas/docs/products/docs-create.schema.js";
import { editProductSchema } from "../schemas/docs/products/docs-edit.schema.js";
import { getProductSchema } from "../schemas/docs/products/docs-get-product.schema.js";
import { searchProductsSchema } from "../schemas/docs/products/docs-search-products.schema.js";

export async function productsRoutes(app: FastifyTypeInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/products", { schema: createProductSchema }, createProduct);
  app.get("/products", { schema: searchProductsSchema }, searchProducts);
  app.get("/products/:productId", { schema: getProductSchema }, getProduct);
  app.put("/products/:productId", { schema: editProductSchema }, editProduct);
}
