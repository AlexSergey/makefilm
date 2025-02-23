import { StatusEnum } from './status.types';

export const FrontEndStatus = {
  Active: StatusEnum.Active,
  NotActive: StatusEnum.NotActive,
  NotInTheSystem: 'NotInTheSystem',
} as const;

export type IFrontEndStatus = (typeof FrontEndStatus)[keyof typeof FrontEndStatus];
