import { DecodedAuthToken } from '@po/shared/models';
import { Request } from 'express';

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedAuthToken;
}
