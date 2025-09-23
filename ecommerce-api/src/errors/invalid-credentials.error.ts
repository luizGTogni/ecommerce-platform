import { AppError } from "./app.error.js";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super({
      message: "Invalid Credentials.",
      name: "InvalidCredentials",
      statusCode: 401,
    });
  }
}
