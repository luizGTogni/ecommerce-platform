import { env } from "@/configs/env.js";
import { RedisClient } from "@/configs/redis.js";
import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { errorHandler } from "./middlewares/error.middleware.js";
import { usersRoutes } from "./routes/users.route.js";
import { productsRoutes } from "./routes/products.route.js";
import { cartsRoutes } from "./routes/carts.route.js";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

export const redis = RedisClient.getClient();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

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

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(usersRoutes);
app.register(productsRoutes);
app.register(cartsRoutes);

app.setErrorHandler(async (error, request, reply) => {
  if (env.NODE_ENV !== "production") {
    console.log(error);
  }

  await errorHandler(error, request, reply);
});
