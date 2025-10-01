import { addProductToCart } from "../controllers/carts/add-product-to-cart.controller.js";
import { removeProductToCart } from "../controllers/carts/remove-product-to-cart.controller.js";
import { updateProductToCart } from "../controllers/carts/update-product-to-cart.controller.js";

import type { FastifyTypeInstance } from "../interfaces/fastify-types.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
import { addProductToCartSchema } from "../schemas/docs/carts/docs-add-product-to-cart.schema.js";
import { removeProductToCartSchema } from "../schemas/docs/carts/docs-remove-product-to-cart.schema.js";
import { updateProductToCartSchema } from "../schemas/docs/carts/docs-update-product-to-cart.schema.js";

export async function cartsRoutes(app: FastifyTypeInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post(
    "/cart/:productId",
    { schema: addProductToCartSchema },
    addProductToCart,
  );

  app.delete(
    "/cart/:cartItemId",
    { schema: removeProductToCartSchema },
    removeProductToCart,
  );

  app.patch(
    "/cart/:cartItemId",
    { schema: updateProductToCartSchema },
    updateProductToCart,
  );
}
