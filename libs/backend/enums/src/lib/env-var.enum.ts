/**
 * Available environment variables used in the backend.
 */
export enum EnvVar {
  NodeEnv = 'NODE_ENV',
  Port = 'PORT',
  DatabaseUrl = 'DATABASE_URL',
  PgHost = 'PG_HOST',
  PgPort = 'PG_PORT',
  PgUser = 'PG_USER',
  PgPassword = 'PG_PASSWORD',
  PgDatabase = 'PG_DATABASE',
  PgSsl = 'PG_SSL',
  HostingEnv = 'HOSTING_ENV',
  FrontendUrl = 'FRONTEND_URL',
}
