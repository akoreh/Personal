import { User } from '@po/backend/entities';
import { EnvVar } from '@po/backend/enums';
import { getEnvVar } from '@po/backend/utilities';
import { DataSource, DataSourceOptions } from 'typeorm';

function parseDatabaseUrl(url: string): {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean | { rejectUnauthorized: boolean };
} {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? parseInt(u.port, 10) : 5432,
    username: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    ssl:
      u.searchParams.get('ssl') === 'true' ||
      process.env[EnvVar.PgSsl] === 'true'
        ? true
        : false,
  };
}

function buildOptions(): DataSourceOptions {
  const databaseUrl = process.env[EnvVar.DatabaseUrl];

  const cfg = databaseUrl
    ? parseDatabaseUrl(databaseUrl)
    : {
        host: getEnvVar(EnvVar.PgHost),
        port: parseInt(getEnvVar(EnvVar.PgPort), 10),
        username: getEnvVar(EnvVar.PgUser),
        password: getEnvVar(EnvVar.PgPassword),
        database: getEnvVar(EnvVar.PgDatabase),
        ssl: process.env[EnvVar.PgSsl] === 'true',
      };

  const nodeEnv = getEnvVar(EnvVar.NodeEnv);

  return {
    type: 'postgres',
    host: cfg.host,
    port: cfg.port,
    username: cfg.username,
    password: cfg.password,
    database: cfg.database,
    ssl: cfg.ssl,
    entities: [User],
    migrations: [],
    synchronize: nodeEnv !== 'production',
    logging: nodeEnv === 'development',
  };
}

export const AppDataSource = new DataSource(buildOptions());
