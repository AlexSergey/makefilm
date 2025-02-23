import { DatabaseConfig } from '../common/database/config/database-config.type';
import { AuthConfig } from '../modules/auth/config/auth-config.type';
import { JwtConfig } from '../modules/jwt/config/jwt-config.type';
import { MailerConfig } from '../modules/mailer/config/mailer-config.type';
import { PasswordConfig } from '../modules/password/config/password-config.type';
import { AppConfig } from './app-config.type';

export interface AllConfigType {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  mailer: MailerConfig;
  password: PasswordConfig;
}
