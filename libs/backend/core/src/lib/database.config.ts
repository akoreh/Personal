import { User } from '@po/backend/entities';
import { DataSource, DataSourceOptions } from 'typeorm';

export function getDataSourceOptions(): DataSourceOptions {
  return {
    type: 'mysql',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '3306', 10),
    username: process.env['DB_USER'] || 'personal_user',
    password: process.env['DB_PASSWORD'] || 'personal_pass',
    database: process.env['DB_NAME'] || 'personal_db',
    entities: [User],
    migrations: [],
    synchronize: process.env['NODE_ENV'] === 'development',
    logging: process.env['NODE_ENV'] === 'development',
  };
}

export const AppDataSource = new DataSource(getDataSourceOptions());
