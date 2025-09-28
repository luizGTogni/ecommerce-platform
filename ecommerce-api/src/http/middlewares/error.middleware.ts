import { AppError } from "@/errors/app.error.js";
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export async function errorHandler(
  err: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (err instanceof AppError) {
    return reply
      .status(err.statusCode)
      .send({ title: err.name, detail: err.message });
  }

  return reply
    .status(500)
    .send({ title: "Internal server error.", detail: err.message });
}
