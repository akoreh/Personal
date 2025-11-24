import { EnvVar } from '@po/backend/enums';
import { getEnvVar } from '@po/backend/utilities';
import { isNil } from 'lodash';

export const isDev = () => getEnvVar(EnvVar.NodeEnv) === 'development';
export const isProduction = () => getEnvVar(EnvVar.NodeEnv) === 'production';

export const isHosted = () => {
  const hostingEnv = getEnvVar(EnvVar.HostingEnv);

  return !isNil(hostingEnv) && hostingEnv !== 'local';
};

export const frontendUrl = () => getEnvVar(EnvVar.FrontendUrl);
