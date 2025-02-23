import { UserRolesEnum } from './role.types';
import { StatusEnum } from './status.types';

export interface User {
  role: UserRolesEnum;
  session_id: string;
  status: StatusEnum;
  user_id: string;
  username?: string;
}

export interface UserRes {
  created_at: Date;
  email: string;
  id: string;
  role: UserRolesEnum;
  status: StatusEnum;
  updated_at: Date;
  username?: string;
}
