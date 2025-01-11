import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Sorting {
  direction: string;
  property: string;
}
// query param: ?sort=["id","ASC"]
export const SortParams = createParamDecorator((validParams, ctx: ExecutionContext): Sorting => {
  const req: Request = ctx.switchToHttp().getRequest();

  const sort = req.query.sort;

  if (typeof sort !== 'string') {
    return null;
  }

  const [property, direction] = JSON.parse(sort);

  const sortPattern = /^ASC|DESC$/;

  if (!direction.match(sortPattern)) {
    throw new BadRequestException('Invalid sort parameter');
  }

  if (typeof property !== 'string') {
    throw new BadRequestException('Invalid sort parameter');
  }

  return { direction, property };
});
