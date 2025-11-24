import { EnvVar } from '@po/backend/enums';

import { getEnvVar } from './env.util';

describe('getEnvVar', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return the value of an existing environment variable', () => {
    process.env[EnvVar.Port] = '3000';
    expect(getEnvVar(EnvVar.Port)).toBe('3000');
  });

  it('should throw an error if the environment variable is not set', () => {
    delete process.env[EnvVar.Port];
    expect(() => getEnvVar(EnvVar.Port)).toThrow(
      'Environment variable PORT is required but not set',
    );
  });

  it('should throw an error if the environment variable is empty', () => {
    process.env[EnvVar.Port] = '';
    expect(() => getEnvVar(EnvVar.Port)).toThrow(
      'Environment variable PORT is required but not set',
    );
  });

  it('should throw an error if the environment variable contains only whitespace', () => {
    process.env[EnvVar.Port] = '   ';
    expect(() => getEnvVar(EnvVar.Port)).toThrow(
      'Environment variable PORT is required but not set',
    );
  });
});
