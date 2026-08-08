import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AppError } from './app-error';
import { Response } from 'express';

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(exception.statusCode)
      .json({ error: exception.message, code: exception.statusCode });
  }
}
