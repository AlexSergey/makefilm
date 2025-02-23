import { AuthProviderEnum, StatusEnum } from '@makefilm/contracts';
import { SessionsEntity } from '@makefilm/entities';
import { Exclude } from 'class-transformer';

export class SessionSerializer {
  authProvider: AuthProviderEnum;
  created_at: Date;
  id: string;
  ip: string;
  lat: string;
  lng: string;
  status: StatusEnum;
  @Exclude()
  token: string;
  updated_at: Date;

  @Exclude()
  user: string;

  userAgent: string;

  constructor(partial: Partial<SessionsEntity>) {
    Object.assign(this, partial);
  }
}
