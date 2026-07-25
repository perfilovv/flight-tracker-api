import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AppError } from './AppError';

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .status(exception.statusCode)
      .json({ error: exception.message, code: exception.statusCode });
  }
}
