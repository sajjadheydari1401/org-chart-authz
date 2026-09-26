import { Injectable, type LoggerService } from '@nestjs/common';
import winston from 'winston';

export const appLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

function toLogMessage(message: unknown): string {
  if (typeof message === 'string') return message;
  try {
    return JSON.stringify(message);
  } catch {
    return String(message);
  }
}

@Injectable()
export class WinstonNestLogger implements LoggerService {
  log(message: unknown, ...optionalParams: unknown[]): void {
    appLogger.info(toLogMessage(message), { optionalParams });
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    appLogger.error(toLogMessage(message), { optionalParams });
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    appLogger.warn(toLogMessage(message), { optionalParams });
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    appLogger.debug(toLogMessage(message), { optionalParams });
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    appLogger.verbose(toLogMessage(message), { optionalParams });
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    appLogger.error(toLogMessage(message), { optionalParams });
  }
}
