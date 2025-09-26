import { AppError } from "./app.error.js";

export class SessionInvalidError extends AppError {
  constructor() {
    super({
      message: "Session invalid.",
      name: "SessionInvalid",
      statusCode: 401,
    });
  }
}
