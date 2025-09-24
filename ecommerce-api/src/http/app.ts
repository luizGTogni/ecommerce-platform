import { env } from "@/configs/env.js";
import fastify from "fastify";
import { errorHandler } from "./middlewares/error.middleware.js";
import { usersRoutes } from "./routes/users.route.js";

export const app = fastify();

app.register(usersRoutes);

app.setErrorHandler(async (error, _, reply) => {
  if (env.NODE_ENV !== "production") {
    console.log(error);
  }

  const response = await errorHandler(error);

  return reply.status(response.statusCode).send(response.body);
});
