import { AppDataSource } from '@po/backend/core';
import { User } from '@po/backend/entities';
import { JwtError } from '@po/backend/enums';
import { buildError } from '@po/backend/utilities';
import { ErrorCode } from '@po/shared/enums';
import {
  AuthTokenPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from '@po/shared/models';
import { Request, Response } from 'express';

import { RefreshTokenDto, TokenResponseDto } from './models/auth.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './utils/jwt.util';
import { comparePassword, hashPassword } from './utils/password.util';

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: RegisterPayload = req.body;

      const existingUser = await this.findUserByEmail(email);

      if (existingUser) {
        res
          .status(409)
          .json(buildError(ErrorCode.UserExists, undefined, req.path));

        return;
      }

      const user = await this.createUser(email, password);
      const authResponse = this.buildAuthResponse(user);

      res.status(201).json(authResponse);
    } catch (error) {
      this.handleError(res, error, 'Registration error', req.path);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginPayload = req.body;

      const user = await this.findUserByEmail(email);
      if (!user) {
        res
          .status(401)
          .json(buildError(ErrorCode.InvalidCredentials, undefined, req.path));
        return;
      }

      if (!this.isUserActive(user, res, req.path)) return;

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        res
          .status(401)
          .json(buildError(ErrorCode.InvalidCredentials, undefined, req.path));
        return;
      }

      const authResponse = this.buildAuthResponse(user);
      res.json(authResponse);
    } catch (error) {
      this.handleError(res, error, 'Login error', req.path);
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenDto = req.body;

      if (!refreshToken) {
        res
          .status(400)
          .json(
            buildError(
              ErrorCode.MissingToken,
              'Refresh token is required',
              req.path,
            ),
          );
        return;
      }

      const decoded = verifyRefreshToken(refreshToken);
      const user = await this.findUserById(decoded.userId);

      if (!user) {
        res
          .status(401)
          .json(buildError(ErrorCode.UserNotFound, undefined, req.path));
        return;
      }

      if (!this.isUserActive(user, res, req.path)) return;

      const tokenResponse = this.buildTokenResponse(user);
      res.json(tokenResponse);
    } catch (error) {
      this.handleRefreshError(res, error, req.path);
    }
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  private async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async createUser(email: string, password: string): Promise<User> {
    const hashedPassword = await hashPassword(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  private isUserActive(user: User, res: Response, path: string): boolean {
    if (!user.isActive) {
      res
        .status(403)
        .json(buildError(ErrorCode.AccountInactive, undefined, path));
      return false;
    }
    return true;
  }

  private createTokenPayload(user: User): AuthTokenPayload {
    return {
      userId: user.id,
      email: user.email,
    };
  }

  private generateTokens(payload: AuthTokenPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  }

  private buildAuthResponse(user: User): LoginResponse {
    const tokenPayload = this.createTokenPayload(user);
    const tokens = this.generateTokens(tokenPayload);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private buildTokenResponse(user: User): TokenResponseDto {
    const tokenPayload = this.createTokenPayload(user);
    return this.generateTokens(tokenPayload);
  }

  private handleError(
    res: Response,
    error: unknown,
    logMessage: string,
    path: string,
  ): void {
    console.error(logMessage, error);
    res.status(500).json(buildError(ErrorCode.InternalError, undefined, path));
  }

  private handleRefreshError(
    res: Response,
    error: unknown,
    path: string,
  ): void {
    if (error instanceof Error) {
      if (error.name === JwtError.TokenExpired) {
        res
          .status(401)
          .json(
            buildError(
              ErrorCode.TokenExpired,
              'Refresh token has expired',
              path,
            ),
          );
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        res
          .status(401)
          .json(
            buildError(ErrorCode.InvalidToken, 'Invalid refresh token', path),
          );
        return;
      }
    }

    console.error('Token refresh error:', error);
    res.status(500).json(buildError(ErrorCode.InternalError, undefined, path));
  }
}
