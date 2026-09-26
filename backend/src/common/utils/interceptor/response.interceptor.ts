import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                const request = context.switchToHttp().getRequest<Request>();
                const response = {
                    status: 'success',
                    data: data,
                    message: {
                        fa: 'عملیات با موفقیت اجرا شد',
                        en: 'The request was successful',
                    },
                    timestamp: new Date().toISOString(),
                    path: request.url,
                };
                return response;
            }),
        );
    }
}
