import { ErrorCode } from '@po/shared/enums';

export interface ApiErrorResponse {
  errorCode: ErrorCode;
  errorMessage: string;
  timestamp?: string;
  path?: string;
}
