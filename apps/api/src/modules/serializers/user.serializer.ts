import { UsersEntity } from '@makefilm/entities';
import { Exclude } from 'class-transformer';

export class UserSerializer {
  @Exclude()
  password: string;

  constructor(partial: Partial<UsersEntity>) {
    Object.assign(this, partial);
  }
}
