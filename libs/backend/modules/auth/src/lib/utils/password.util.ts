import { EnvVar } from '@po/backend/enums';
import { getEnvVar } from '@po/backend/utilities';
import { compare, hash } from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, parseInt(getEnvVar(EnvVar.PasswordSaltRounds), 10));
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(password, hashedPassword);
}
