import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { envVars } from '../../common/envs';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    const isProduction = envVars.ENV === 'prod';

    if (isProduction) {
      message =
        'An error occurred. Please try again later and contact the admin';
    } else {
      message = exception.message || 'Error';
    }

    let stack: string | undefined;

    if (exception instanceof Error) {
      stack = exception.stack;
    }

    if (exception instanceof HttpException) {
      message = exception.message || 'Error';
    } else if (exception instanceof Error) {
      message = exception.message || 'Error';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      // stack: stack,
    });

    // if (isProduction) {}
  }
}
