import { authenticate } from "../controllers/users/authenticate.controller.js";
import { createUser } from "../controllers/users/create.controller.js";
import { deleteUser } from "../controllers/users/delete.controller.js";
import { editUser } from "../controllers/users/edit.controller.js";
import { getProfile } from "../controllers/users/get-user-profile.controller.js";
import { logout } from "../controllers/users/logout.controller.js";
import { refreshToken } from "../controllers/users/refresh-token.controller.js";
import { searchUsers } from "../controllers/users/search-users.controller.js";
import type { FastifyTypeInstance } from "../interfaces/fastify-types.js";
import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
import { authenticateSchema } from "../schemas/docs/users/docs-authenticate.schema.js";
import { createUserSchema } from "../schemas/docs/users/docs-create.schema.js";
import { deleteUserSchema } from "../schemas/docs/users/docs-delete.schema.js";
import { editUserSchema } from "../schemas/docs/users/docs-edit.schema.js";
import { getUserProfileSchema } from "../schemas/docs/users/docs-get-profile.schema.js";
import { logoutSchema } from "../schemas/docs/users/docs-logout.schema.js";
import { refreshTokenSchema } from "../schemas/docs/users/docs-refresh-token.schema.js";
import { searchUsersSchema } from "../schemas/docs/users/docs-search-users.schema.js";

export async function usersRoutes(app: FastifyTypeInstance) {
  app.post("/users", { schema: createUserSchema }, createUser);

  app.post("/sessions", { schema: authenticateSchema }, authenticate);
  app.post("/logout", { schema: logoutSchema, onRequest: [verifyJWT] }, logout);
  app.patch("/token/refresh", { schema: refreshTokenSchema }, refreshToken);

  app.put(
    "/users",
    { schema: editUserSchema, onRequest: [verifyJWT] },
    editUser,
  );

  app.delete(
    "/users",
    {
      schema: deleteUserSchema,
      onRequest: [verifyJWT],
    },
    deleteUser,
  );

  app.get(
    "/me",
    { schema: getUserProfileSchema, onRequest: [verifyJWT] },
    getProfile,
  );
  app.get(
    "/users",
    { schema: searchUsersSchema, onRequest: [verifyJWT] },
    searchUsers,
  );
}
