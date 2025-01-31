export interface AppConfig {
  apiPrefix: string;
  apiUrl: string;
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
