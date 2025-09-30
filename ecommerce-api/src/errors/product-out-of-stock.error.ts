import { AppError } from "./app.error.js";

export class ProductOutOfStockError extends AppError {
  constructor() {
    super({
      message: "Product out of stock.",
      name: "ProductOutOfStock",
      statusCode: 400,
    });
  }
}
