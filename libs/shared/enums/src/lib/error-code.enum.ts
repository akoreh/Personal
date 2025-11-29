/**
 * Error codes returned from the backend API.
 * Format: [Category][Number] (e.g., AUTH001, VAL002)
 */
export enum ErrorCode {
  // Authentication errors (AUTH)
  MissingToken = 'AUTH001',
  InvalidTokenFormat = 'AUTH002',
  TokenExpired = 'AUTH003',
  InvalidToken = 'AUTH004',
  InvalidCredentials = 'AUTH005',
  AccountInactive = 'AUTH006',
  TooManyAuthRequests = 'AUTH007',

  // Validation errors (VAL)
  MissingFields = 'VAL001',
  MissingEmail = 'VAL002',
  MissingPassword = 'VAL003',
  InvalidEmail = 'VAL004',
  WeakPassword = 'VAL005',

  // User/Resource errors (USR)
  UserExists = 'USR001',
  UserNotFound = 'USR002',

  // Rate limiting errors (RATE)
  TooManyRequests = 'RATE001',
  TooManyRegistrations = 'RATE002',

  // Server errors (SRV)
  InternalError = 'SRV001',
  DatabaseError = 'SRV002',
  RequestTimeout = 'SRV003',
}
