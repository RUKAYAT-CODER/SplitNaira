import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(
          JSON.stringify({
            method: request.method,
            path: request.url,
            correlationId: request.correlationId,
            durationMs: Date.now() - startedAt,
          }),
        );
      }),
    );
  }
}