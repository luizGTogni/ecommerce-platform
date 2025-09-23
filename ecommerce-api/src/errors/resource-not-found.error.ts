import { AppError } from "./app.error.js";

export class ResourceNotFoundError extends AppError {
  constructor() {
    super({
      message: "Resource not found.",
      name: "ResourceNotFound",
      statusCode: 404,
    });
  }
}
