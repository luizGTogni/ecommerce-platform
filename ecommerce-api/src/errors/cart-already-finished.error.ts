import { AppError } from "./app.error.js";

export class CartAlreadyFinishedError extends AppError {
  constructor(status: string) {
    super({
      message: `Cart is already ${status.toLowerCase()}`,
      name: "CartAlreadyFinished",
      statusCode: 409,
    });
  }
}
