import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { env } from "@/configs/env.js";
import fastify from "fastify";
import { errorHandler } from "./middlewares/error.middleware.js";
import { usersRoutes } from "./routes/users.route.js";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "15m",
  },
});

app.register(fastifyCookie);

app.register(usersRoutes);

app.setErrorHandler(async (error, request, reply) => {
  if (env.NODE_ENV !== "production") {
    console.log(error);
  }

  const response = await errorHandler(error, request, reply);

  return reply.status(response.statusCode).send(response.body);
});
