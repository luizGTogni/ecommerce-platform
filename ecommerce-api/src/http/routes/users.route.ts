import { FastifyInstance } from "fastify";
import { createUser } from "../controllers/users/create.controller.js";
import { authenticate } from "../controllers/users/authenticate.controller.js";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", createUser);
  app.post("/sessions", authenticate);
}
