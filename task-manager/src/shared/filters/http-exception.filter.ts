import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    response
      .status(status)
      .json({
        success: false,
        message: exceptionResponse.message || 'An error occurred',
        error: exceptionResponse.error,
        timestamp: new Date().toISOString(),
      });
  }
} 