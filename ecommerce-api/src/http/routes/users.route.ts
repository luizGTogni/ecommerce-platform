import { FastifyInstance } from "fastify";
import { CreateUserController } from "../controllers/users/create.controller.js";
import { fastifyRouteAdapter } from "../adapters/fastify.adapter.js";

export async function usersRoutes(app: FastifyInstance) {
  const createUserController = new CreateUserController();

  app.post("/users", fastifyRouteAdapter(createUserController));
}
