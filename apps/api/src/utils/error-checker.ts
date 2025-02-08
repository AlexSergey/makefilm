import { HttpStatus } from '@nestjs/common';

export const checkStatus = (statusCode: number): boolean => {
  return [HttpStatus.ACCEPTED, HttpStatus.CREATED, HttpStatus.NO_CONTENT, HttpStatus.OK].includes(statusCode);
};
