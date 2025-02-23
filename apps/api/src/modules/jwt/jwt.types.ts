import { UserForToken } from '../users/user.types';

export interface JwtDecoded {
  exp: number;
  iat: number;
  user: UserForToken;
}
