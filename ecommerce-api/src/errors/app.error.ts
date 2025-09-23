interface IAppError {
  message: string;
  name: string;
  statusCode: number;
}

export class AppError extends Error {
  public readonly statusCode;

  constructor({ message, name, statusCode }: IAppError) {
    super(message);
    this.message = message;
    this.name = name;
    this.statusCode = statusCode;
  }
}
