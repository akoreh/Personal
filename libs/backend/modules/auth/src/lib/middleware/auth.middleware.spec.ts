import { JwtError } from '@po/backend/enums';
import { ErrorCode } from '@po/shared/enums';
import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '../models/auth.model';
import { verifyAccessToken } from '../utils/jwt.util';
import { authMiddleware } from './auth.middleware';

jest.mock('../utils/jwt.util');

describe('authMiddleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      headers: {},
    };

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('Missing Authorization Header', () => {
    test('should return 401 with MissingToken error when no authorization header', () => {
      authMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.MissingToken,
          errorMessage: expect.any(String),
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Authorization Header Format', () => {
    test('should return 401 with InvalidTokenFormat error when header does not start with Bearer', () => {
      mockRequest.headers = { authorization: 'Basic token123' };

      authMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.InvalidTokenFormat,
          errorMessage: expect.any(String),
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 401 with MissingToken error when Bearer token is empty', () => {
      mockRequest.headers = { authorization: 'Bearer ' };

      authMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.MissingToken,
          errorMessage: expect.any(String),
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 401 with InvalidTokenFormat error when Bearer has no token', () => {
      mockRequest.headers = { authorization: 'Bearer' };

      authMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.InvalidTokenFormat,
          errorMessage: expect.any(String),
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Valid Token', () => {
    test('should attach user to request and call next when token is valid', () => {
      const mockDecodedToken = { userId: '123', email: 'test@example.com' };
      (verifyAccessToken as jest.Mock).mockReturnValue(mockDecodedToken);

      mockRequest.headers = { authorization: 'Bearer validtoken123' };

      authMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(verifyAccessToken).toHaveBeenCalledWith('validtoken123');
      expect(mockRequest.user).toEqual(mockDecodedToken);
      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe('Token Verification Errors', () => {
    test('should return 401 with TokenExpired error when token is expired', () => {
      const expiredError = new Error('Token expired');
      expiredError.name = JwtError.TokenExpired;
      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw expiredError;
      });

      mockRequest.headers = { authorization: 'Bearer expiredtoken' };

      authMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.TokenExpired,
          errorMessage: expect.any(String),
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 401 with InvalidToken error when token is malformed', () => {
      const invalidError = new Error('Invalid token');
      invalidError.name = JwtError.InvalidToken;
      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw invalidError;
      });

      mockRequest.headers = { authorization: 'Bearer invalidtoken' };

      authMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.InvalidToken,
          errorMessage: expect.any(String),
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 500 with InternalError for unknown errors', () => {
      const unknownError = new Error('Something went wrong');
      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw unknownError;
      });

      mockRequest.headers = { authorization: 'Bearer sometoken' };

      authMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.InternalError,
          errorMessage: expect.any(String),
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 500 with InternalError for non-Error exceptions', () => {
      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw 'string error';
      });

      mockRequest.headers = { authorization: 'Bearer sometoken' };

      authMiddleware(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        mockNext,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: ErrorCode.InternalError,
          errorMessage: expect.any(String),
        }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
