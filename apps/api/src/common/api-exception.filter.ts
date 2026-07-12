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
} from '@nestjs/common';
import type { Response } from 'express';

/** Maps HTTP exceptions to `{ ok: false, error }` responses. */
@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
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
