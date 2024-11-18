import { config } from 'dotenv';
import process from 'node:process';

import { AppEnv } from '../enum/app.enum';
import { AppConfig } from '../models/app-config.model';

const envFound = config();

if (!envFound) {
  throw new Error("Couldn't find .env file!");
}

export const appConfig: AppConfig = {
  env: process.env['NODE_ENV'] as AppEnv,
  port: parseInt(process.env['PORT'], 10) as number,
  host: process.env['HOST'] as string,
  dbConnectionString: process.env['DB_CONNECT_URL'],
};
