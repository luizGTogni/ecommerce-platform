import { AppError } from "./app.error.js";

export class ResourceAlreadyExistsError extends AppError {
  constructor() {
    super({
      message: "Resource already exists",
      name: "ResourceAlreadyExists",
      statusCode: 409,
    });
  }
}
