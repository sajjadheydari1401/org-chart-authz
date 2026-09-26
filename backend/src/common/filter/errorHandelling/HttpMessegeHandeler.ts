import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { normalizeError } from '../normalize-error.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    if (response.headersSent) return;

    const error = normalizeError(exception);
    // Axios errors may include credentials; log only safe request metadata.
    if (error.statusCode >= 500) {
      this.logger.error({ statusCode: error.statusCode, method: request.method, path: request.path });
    }
    response.status(error.statusCode).json({
      ...error,
      timestamp: new Date().toISOString(),
      path: request.path,
    });
  }
}
