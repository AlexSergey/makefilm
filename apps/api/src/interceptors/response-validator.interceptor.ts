import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { validationError } from 'class-validator-flat-formatter';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ResponseValidationInterceptor<T extends object> implements NestInterceptor<never, T> {
  constructor(private readonly dto: new () => T) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      switchMap(async (data) => {
        const transformedData = plainToInstance(this.dto, instanceToPlain(data));
        const errors = await validate(transformedData);

        if (errors.length > 0) {
          const message = validationError(errors);
          // eslint-disable-next-line
          console.error(message);

          throw new InternalServerErrorException({
            errors: errors,
            message: 'Response validation failed',
          });
        }

        return transformedData;
      }),
    );
  }
}
