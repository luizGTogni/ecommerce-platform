import { FastifyInstance } from "fastify";
import { createUser } from "../controllers/users/create.controller.js";
import { authenticate } from "../controllers/users/authenticate.controller.js";
import { refreshToken } from "../controllers/users/refresh-token.controller.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
import { getProfile } from "../controllers/users/get-user-profile.controller.js";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", createUser);
  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refreshToken);

  app.get("/me", { onRequest: [verifyJWT] }, getProfile);
}
