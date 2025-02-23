import { StatusEnum, UserRolesEnum } from '@makefilm/contracts';
import { FindOperator } from 'typeorm';

export interface FilterUser {
  role: UserRolesEnum;
}

export type GetUserWhere = {
  email?: FindOperator<string>;
  role?: UserRolesEnum;
  username?: FindOperator<string>;
}[];

export interface UserForToken {
  email: string;
  role: UserRolesEnum;
  status: StatusEnum;
  user_id: string;
}
