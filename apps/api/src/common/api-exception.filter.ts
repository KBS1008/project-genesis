/**
 * @module @project-genesis/api/common/api-exception.filter
 *
 * Normalizes NestJS HTTP exceptions to the browser shell JSON envelope.
 */

import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

const UNEXPECTED_SERVER_ERROR = 'An unexpected server error occurred.';

/** Maps HTTP and unexpected exceptions to the browser shell JSON envelope. */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (!(exception instanceof HttpException)) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        error: UNEXPECTED_SERVER_ERROR,
      });
      return;
    }

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : typeof exceptionResponse === 'object' &&
            exceptionResponse !== null &&
            'message' in exceptionResponse
          ? Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message.join(', ')
            : String(exceptionResponse.message)
          : exception.message;

    response.status(statusCode).json({
      ok: false,
      error: message,
    });
  }
}
