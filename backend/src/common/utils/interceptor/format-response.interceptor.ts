import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
interface Response<T> {
  status: string;
  data: T;
  message: {
    fa: string;
    en: string;
  };
  timestamp: string;
}

@Injectable()
export class FormatResponseInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = {
          status: 'success',
          data: data,
          message: {
            fa: 'عملیات با موفقیت اجرا شد',
            en: 'The request was successful',
          },
          timestamp: new Date().toISOString(),
        };
        return response;
      }),
    );
  }
}
