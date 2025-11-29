import { ErrorCode } from '@po/shared/enums';
import { NextFunction, Request, Response } from 'express';

import {
  validateEmail,
  validateLoginPayload,
  validatePassword,
  validateRegisterPayload,
} from './auth.validator';

describe('validateEmail', () => {
  test('should return MissingEmail error when email is null', () => {
    const result = validateEmail(null as unknown as string);

    expect(result).toMatchObject({
      errorCode: ErrorCode.MissingEmail,
      errorMessage: expect.any(String),
    });
  });

  test('should return MissingEmail error when email is undefined', () => {
    const result = validateEmail(undefined as unknown as string);

    expect(result).toMatchObject({
      errorCode: ErrorCode.MissingEmail,
      errorMessage: expect.any(String),
    });
  });

  test('should return MissingEmail error when email is empty string', () => {
    const result = validateEmail('');

    expect(result).toMatchObject({
      errorCode: ErrorCode.MissingEmail,
      errorMessage: expect.any(String),
    });
  });

  test('should return MissingEmail error when email is whitespace', () => {
    const result = validateEmail('   ');

    expect(result).toMatchObject({
      errorCode: ErrorCode.MissingEmail,
      errorMessage: expect.any(String),
    });
  });

  test('should return InvalidEmail error when email format is invalid', () => {
    const result = validateEmail('not-an-email');

    expect(result).toMatchObject({
      errorCode: ErrorCode.InvalidEmail,
      errorMessage: expect.any(String),
    });
  });

  test('should return InvalidEmail error when email is missing @', () => {
    const result = validateEmail('userexample.com');

    expect(result).toMatchObject({
      errorCode: ErrorCode.InvalidEmail,
      errorMessage: expect.any(String),
    });
  });

  test('should return InvalidEmail error when email is missing domain', () => {
    const result = validateEmail('user@');

    expect(result).toMatchObject({
      errorCode: ErrorCode.InvalidEmail,
      errorMessage: expect.any(String),
    });
  });

  test('should return null when email is valid', () => {
    const result = validateEmail('user@example.com');

    expect(result).toBeNull();
  });

  test('should return null when email has subdomain', () => {
    const result = validateEmail('user@mail.example.com');

    expect(result).toBeNull();
  });

  test('should return null when email has plus addressing', () => {
    const result = validateEmail('user+tag@example.com');

    expect(result).toBeNull();
  });
});

describe('validatePassword', () => {
  test('should return MissingPassword error when password is null', () => {
    const result = validatePassword(null as unknown as string);

    expect(result).toMatchObject({
      errorCode: ErrorCode.MissingPassword,
      errorMessage: expect.any(String),
    });
  });

  test('should return MissingPassword error when password is undefined', () => {
    const result = validatePassword(undefined as unknown as string);

    expect(result).toMatchObject({
      errorCode: ErrorCode.MissingPassword,
      errorMessage: expect.any(String),
    });
  });

  test('should return MissingPassword error when password is empty string', () => {
    const result = validatePassword('');

    expect(result).toMatchObject({
      errorCode: ErrorCode.MissingPassword,
      errorMessage: expect.any(String),
    });
  });

  test('should return WeakPassword error when password is less than 8 characters', () => {
    const result = validatePassword('Short1!');

    expect(result).toMatchObject({
      errorCode: ErrorCode.WeakPassword,
      errorMessage: expect.any(String),
    });
  });

  test('should return WeakPassword error when password has no uppercase letter', () => {
    const result = validatePassword('lowercase123!');

    expect(result).toMatchObject({
      errorCode: ErrorCode.WeakPassword,
      errorMessage: expect.any(String),
    });
  });

  test('should return WeakPassword error when password has no lowercase letter', () => {
    const result = validatePassword('UPPERCASE123!');

    expect(result).toMatchObject({
      errorCode: ErrorCode.WeakPassword,
      errorMessage: expect.any(String),
    });
  });

  test('should return WeakPassword error when password has no number', () => {
    const result = validatePassword('NoNumbers!');

    expect(result).toMatchObject({
      errorCode: ErrorCode.WeakPassword,
      errorMessage: expect.any(String),
    });
  });

  test('should return WeakPassword error when password has no special character', () => {
    const result = validatePassword('NoSpecial123');

    expect(result).toMatchObject({
      errorCode: ErrorCode.WeakPassword,
      errorMessage: expect.any(String),
    });
  });

  test('should return null when password meets all requirements', () => {
    const result = validatePassword('ValidPass123!');

    expect(result).toBeNull();
  });

  test('should return null for complex password with multiple special chars', () => {
    const result = validatePassword('C0mpl3x!@#$P@ssw0rd');

    expect(result).toBeNull();
  });

  test('should accept various special characters', () => {
    const specialChars = '!@#$%^&*(),.?":{}|<>_-+=[]\\\/\'`~;';
    for (const char of specialChars) {
      const result = validatePassword(`Valid1Pass${char}`);
      expect(result).toBeNull();
    }
  });
});

describe('validateRegisterPayload', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  test('should return 400 with MissingEmail error when email is missing', () => {
    mockRequest.body = { password: 'ValidPass123!' };

    validateRegisterPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: ErrorCode.MissingEmail,
        errorMessage: expect.any(String),
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 400 with InvalidEmail error when email format is invalid', () => {
    mockRequest.body = { email: 'invalid-email', password: 'ValidPass123!' };

    validateRegisterPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: ErrorCode.InvalidEmail,
        errorMessage: expect.any(String),
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 400 with MissingPassword error when password is missing', () => {
    mockRequest.body = { email: 'user@example.com' };

    validateRegisterPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: ErrorCode.MissingPassword,
        errorMessage: expect.any(String),
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 400 with WeakPassword error when password is weak', () => {
    mockRequest.body = { email: 'user@example.com', password: 'weak' };

    validateRegisterPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: ErrorCode.WeakPassword,
        errorMessage: expect.any(String),
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should call next when both email and password are valid', () => {
    mockRequest.body = {
      email: 'user@example.com',
      password: 'ValidPass123!',
    };

    validateRegisterPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });
});

describe('validateLoginPayload', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  test('should return 400 with MissingEmail error when email is missing', () => {
    mockRequest.body = { password: 'anypassword' };

    validateLoginPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: ErrorCode.MissingEmail,
        errorMessage: expect.any(String),
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 400 with InvalidEmail error when email format is invalid', () => {
    mockRequest.body = { email: 'not-an-email', password: 'anypassword' };

    validateLoginPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: ErrorCode.InvalidEmail,
        errorMessage: expect.any(String),
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 400 with MissingPassword error when password is missing', () => {
    mockRequest.body = { email: 'user@example.com' };

    validateLoginPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: ErrorCode.MissingPassword,
        errorMessage: expect.any(String),
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 400 with MissingPassword error when password is empty string', () => {
    mockRequest.body = { email: 'user@example.com', password: '' };

    validateLoginPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: ErrorCode.MissingPassword,
        errorMessage: expect.any(String),
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should call next when email is valid and password is provided (no strength validation)', () => {
    mockRequest.body = { email: 'user@example.com', password: 'weak' };

    validateLoginPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  test('should call next when both email and password are valid', () => {
    mockRequest.body = {
      email: 'user@example.com',
      password: 'StrongPass123!',
    };

    validateLoginPayload(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });
});
