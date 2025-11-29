import { EnvVar, HostingEnv } from '@po/backend/enums';
import { getEnvVar } from '@po/backend/utilities';
import { isNil } from 'lodash';

export const isHosted = () => {
  const hostingEnv = getEnvVar(EnvVar.HostingEnv);

  return !isNil(hostingEnv) && hostingEnv === HostingEnv.Heroku;
};
