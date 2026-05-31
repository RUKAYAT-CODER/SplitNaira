import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class StructuredLoggerService implements LoggerService {
  log(message: string, context?: string) {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  error(message: string, trace?: string, context?: string) {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        trace,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  warn(message: string, context?: string) {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}