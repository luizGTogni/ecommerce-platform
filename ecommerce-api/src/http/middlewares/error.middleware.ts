import { AppError } from "@/errors/app.error.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function errorHandler(
  err: Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      body: {
        title: err.name,
        detail: err.message,
      },
    };
  }

  return reply
    .status(500)
    .send({ title: "Internal server error.", detail: err.message });
}
