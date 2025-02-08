export interface DatabaseConfig {
  ca?: string;
  cert?: string;
  host?: string;
  key?: string;
  logging?: boolean;
  maxConnections: number;
  name?: string;
  password?: string;
  port?: number;
  rejectUnauthorized?: boolean;
  showLogs?: boolean;
  sslEnabled?: boolean;
  synchronize?: boolean;
  type?: string;
  url?: string;
  username?: string;
}
