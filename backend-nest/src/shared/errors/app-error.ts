export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);

    this.name = new.target.name;

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace?.(this, new.target);
  }
}
