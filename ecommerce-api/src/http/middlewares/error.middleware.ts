import { AppError } from "@/errors/app.error";
import type { IHttpResponse } from "../interfaces/controller.interface";

interface IErrorResponse {
  title: string;
  detail: string;
}

export async function errorHandler(
  err: Error,
): Promise<IHttpResponse<IErrorResponse>> {
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      body: {
        title: err.name,
        detail: err.message,
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      title: "Server error",
      detail: err.message,
    },
  };
}
