import knex from 'knex';

import { appConfig } from '../config/app.config';

const pg = knex({
  debug: false,
  client: 'pg',
  connection: {
    connectionString: appConfig.dbConnectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  searchPath: ['public'],
  // pool: isDev ? { max: 4 } : { min: 4 },
  asyncStackTraces: true,
});
