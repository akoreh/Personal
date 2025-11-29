import { JwtError } from '@po/backend/enums';
import { buildError } from '@po/backend/utilities';
import { ErrorCode } from '@po/shared/enums';
import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '../models/auth.model';
import { verifyAccessToken } from '../utils/jwt.util';

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json(buildError(ErrorCode.MissingToken));
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json(buildError(ErrorCode.InvalidTokenFormat));
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json(buildError(ErrorCode.MissingToken));
      return;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === JwtError.TokenExpired) {
        res.status(401).json(buildError(ErrorCode.TokenExpired));
        return;
      }

      if (error.name === JwtError.InvalidToken) {
        res.status(401).json(buildError(ErrorCode.InvalidToken));
        return;
      }
    }

    res.status(500).json(buildError(ErrorCode.InternalError));
  }
}
