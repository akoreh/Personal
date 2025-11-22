import { EnvVar } from '@po/backend/enums';
import { isEmptyString } from '@po/shared/utilities';
import { isNil } from 'lodash-es';

/**
 * Retrieves an environment variable, throwing an error if it's not defined.
 * @param name The name of the environment variable
 * @returns The value of the environment variable
 * @throws Error if the environment variable is not defined or empty
 */
export function getEnvVar(name: EnvVar): string {
  const value = process.env[name];

  if (isNil(value) || isEmptyString(value)) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }

  return value;
}
