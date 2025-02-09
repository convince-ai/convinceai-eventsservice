import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const formatResponse = (data: any) => {
  if (
    Object.keys(data).includes('count') &&
    Object.keys(data).includes('limit') &&
    Object.keys(data).includes('page') &&
    Object.keys(data).includes('totalPages')
  )
    return {
      count: data.count,
      limit: data.limit,
      page: data.page,
      totalPages: data.totalPages,
      data: data.data,
    };

  return { data: data };
};

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return data ? formatResponse(data) : undefined;
      }),
    );
  }
}
