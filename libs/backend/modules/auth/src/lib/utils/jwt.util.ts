import { EnvVar } from '@po/backend/enums';
import { getEnvVar } from '@po/backend/utilities';
import { AuthTokenPayload, DecodedAuthToken } from '@po/shared/models';
import { JwtPayload, SignOptions, decode, sign, verify } from 'jsonwebtoken';

export function generateAccessToken(payload: AuthTokenPayload): string {
  const secret = getEnvVar(EnvVar.JwtSecret);
  const expiresIn = getEnvVar(EnvVar.JwtExpiresIn);

  return sign(payload, secret, { expiresIn } as SignOptions);
}

export function generateRefreshToken(payload: AuthTokenPayload): string {
  const secret = getEnvVar(EnvVar.JwtRefreshSecret);
  const expiresIn = getEnvVar(EnvVar.JwtRefreshExpiresIn);

  return sign(payload, secret, { expiresIn } as SignOptions);
}

export function verifyAccessToken(token: string): DecodedAuthToken {
  const secret = getEnvVar(EnvVar.JwtSecret);
  return verify(token, secret) as DecodedAuthToken;
}

export function verifyRefreshToken(token: string): DecodedAuthToken {
  const secret = getEnvVar(EnvVar.JwtRefreshSecret);
  return verify(token, secret) as DecodedAuthToken;
}

export function decodeToken(token: string): DecodedAuthToken | null {
  const decoded = decode(token) as JwtPayload | null;

  if (!decoded) {
    return null;
  }

  return decoded as DecodedAuthToken;
}
