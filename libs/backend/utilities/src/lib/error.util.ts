import { ErrorCode } from '@po/shared/enums';
import { ApiErrorResponse } from '@po/shared/models';

const defaultErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.MissingToken]: 'Authorization token is required',
  [ErrorCode.InvalidTokenFormat]: 'Invalid authorization token format',
  [ErrorCode.TokenExpired]: 'Authorization token has expired',
  [ErrorCode.InvalidToken]: 'Invalid authorization token',
  [ErrorCode.InvalidCredentials]: 'Invalid email or password',
  [ErrorCode.AccountInactive]: 'Account is inactive',
  [ErrorCode.TooManyAuthRequests]:
    'Too many authentication attempts, please try again later',
  [ErrorCode.MissingFields]: 'Required fields are missing',
  [ErrorCode.MissingEmail]: 'Email is required',
  [ErrorCode.MissingPassword]: 'Password is required',
  [ErrorCode.InvalidEmail]: 'Invalid email format',
  [ErrorCode.WeakPassword]: 'The password is too weak',

  [ErrorCode.UserExists]: 'User with this email already exists',
  [ErrorCode.UserNotFound]: 'User not found',
  [ErrorCode.TooManyRequests]: 'Too many requests, please try again later',
  [ErrorCode.TooManyRegistrations]:
    'Too many registration attempts, please try again later',
  [ErrorCode.InternalError]: 'An internal server error occurred',
  [ErrorCode.DatabaseError]: 'A database error occurred',
};

/**
 * Build a standardized API error response
 * @param errorCode - The error code from ErrorCode enum
 * @param message - Optional custom error message (defaults to standard message)
 * @param path - Optional request path where error occurred
 * @returns Standardized API error response
 */
export function buildError(
  errorCode: ErrorCode,
  message?: string,
  path?: string,
): ApiErrorResponse {
  return {
    errorCode,
    errorMessage: message ?? defaultErrorMessages[errorCode],
    timestamp: new Date().toISOString(),
    ...(path && { path }),
  };
}
