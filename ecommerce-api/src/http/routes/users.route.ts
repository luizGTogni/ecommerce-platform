import { FastifyInstance } from "fastify";
import { fastifyRouteAdapter } from "../adapters/fastify.adapter";
import { CreateUserController } from "../controllers/users/create.controller";

export async function usersRoutes(app: FastifyInstance) {
  const createUserController = new CreateUserController();

  app.post("/users", fastifyRouteAdapter(createUserController));
}
