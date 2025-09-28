import { FastifyInstance } from "fastify";
import { authenticate } from "../controllers/users/authenticate.controller.js";
import { createUser } from "../controllers/users/create.controller.js";
import { deleteUser } from "../controllers/users/delete.controller.js";
import { editUser } from "../controllers/users/edit.controller.js";
import { getProfile } from "../controllers/users/get-user-profile.controller.js";
import { logout } from "../controllers/users/logout.controller.js";
import { refreshToken } from "../controllers/users/refresh-token.controller.js";
import { searchUsers } from "../controllers/users/search-users.controller.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", createUser);
  app.post("/sessions", authenticate);
  app.post("/logout", { onRequest: [verifyJWT] }, logout);

  app.patch("/token/refresh", refreshToken);

  app.put("/users", { onRequest: [verifyJWT] }, editUser);

  app.delete("/users", { onRequest: [verifyJWT] }, deleteUser);

  app.get("/me", { onRequest: [verifyJWT] }, getProfile);
  app.get("/users", { onRequest: [verifyJWT] }, searchUsers);
}
