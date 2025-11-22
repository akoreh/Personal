import { isNil } from 'lodash';

export const isDev = () => {
  return process.env['NODE_ENV'] === 'development';
};

export const isProduction = () => {
  return process.env['NODE_ENV'] === 'production';
};

export const isHosted = () => {
  const hostingEnv = process.env['HOSTING_ENV'];

  return !isNil(hostingEnv) && hostingEnv !== 'local';
};

export const frontendUrl = () => process.env['FRONTEND_URL'];
