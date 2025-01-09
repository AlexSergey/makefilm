import { DatabaseConfig } from '../common/database/config/database-config.type';
import { AppConfig } from './app-config.type';

export interface AllConfigType {
  app: AppConfig;
  database: DatabaseConfig;
}
