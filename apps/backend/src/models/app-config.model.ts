import { AppEnv } from '../enum/app.enum';

export interface AppConfig {
  env: AppEnv;
  port: number;
  host: string;
  dbConnectionString: string;
}
