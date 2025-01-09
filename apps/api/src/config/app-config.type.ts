export interface AppConfig {
  apiPrefix: string;
  appUrl: string;
  backendDomain: string;
  fallbackLanguage: string;
  frontendDomain?: string;
  frontendUrl: string;
  headerLanguage: string;
  name: string;
  nodeEnv: string;
  port: number;
  workingDirectory: string;
}
