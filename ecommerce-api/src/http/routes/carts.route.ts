import { addProductToCart } from "../controllers/carts/add-product-to-cart.controller.js";
import { getCart } from "../controllers/carts/get-cart.controller.js";
import { removeProductToCart } from "../controllers/carts/remove-product-to-cart.controller.js";
import { updateCartStatus } from "../controllers/carts/update-cart-status.controller.js";
import { updateProductToCart } from "../controllers/carts/update-product-to-cart.controller.js";

import type { FastifyTypeInstance } from "../interfaces/fastify-types.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
import { addProductToCartSchema } from "../schemas/docs/carts/docs-add-product-to-cart.schema.js";
import { getCartSchema } from "../schemas/docs/carts/docs-get-cart.schema.js";
import { removeProductToCartSchema } from "../schemas/docs/carts/docs-remove-product-to-cart.schema.js";
import { updateCartStatusSchema } from "../schemas/docs/carts/docs-update-cart-status.schema.js";
import { updateProductToCartSchema } from "../schemas/docs/carts/docs-update-product-to-cart.schema.js";

export async function cartsRoutes(app: FastifyTypeInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post(
    "/carts/items",
    { schema: addProductToCartSchema },
    addProductToCart,
  );

  app.delete(
    "/carts/items/:cartItemId",
    { schema: removeProductToCartSchema },
    removeProductToCart,
  );

  app.patch(
    "/carts/items/:cartItemId",
    { schema: updateProductToCartSchema },
    updateProductToCart,
  );

  app.get("/carts/:cartId", { schema: getCartSchema }, getCart);

  app.patch(
    "/carts/:cartId/status",
    { schema: updateCartStatusSchema },
    updateCartStatus,
  );
}
