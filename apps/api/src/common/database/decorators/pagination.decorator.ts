import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
  skip: number;
  take: number;
}
// parse query param range=[0,9]
export const PaginationParams = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
  const req: Request = ctx.switchToHttp().getRequest();
  const range = req.query.range;

  if (typeof range !== 'string') {
    return null;
  }
  try {
    const [start, end] = JSON.parse(range);

    if (typeof start !== 'number' || typeof end !== 'number') {
      throw new BadRequestException('Invalid pagination params');
    }

    return {
      skip: start,
      take: end - start,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw new BadRequestException('Invalid pagination params');
  }
});
