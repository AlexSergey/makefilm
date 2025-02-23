import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginTicket, OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly configService: ConfigService) {}

  async signIn(credential: string): Promise<LoginTicket> {
    const client = new OAuth2Client(this.configService.getOrThrow('auth.googleClientId'));

    return await client.verifyIdToken({
      audience: this.configService.getOrThrow('auth.googleClientId'),
      idToken: credential,
    });
  }
}
