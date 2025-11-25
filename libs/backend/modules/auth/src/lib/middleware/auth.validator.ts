import { buildError } from '@po/backend/utilities';
import { ErrorCode } from '@po/shared/enums';
import { ApiErrorResponse } from '@po/shared/models';
import { isEmptyString } from '@po/shared/utilities';
import { NextFunction, Request, Response } from 'express';
import { isNil } from 'lodash-es';
import validator from 'validator';

export function validateEmail(email: string): ApiErrorResponse | null {
  if (isNil(email) || isEmptyString(email)) {
    return buildError(ErrorCode.MissingEmail);
  }

  if (!validator.isEmail(email)) {
    return buildError(ErrorCode.InvalidEmail);
  }

  return null;
}

export function validatePassword(password: string): ApiErrorResponse | null {
  if (isNil(password) || isEmptyString(password)) {
    return buildError(ErrorCode.MissingPassword);
  }

  if (password.length < 8) {
    return buildError(ErrorCode.WeakPassword);
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return buildError(ErrorCode.WeakPassword);
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return buildError(ErrorCode.WeakPassword);
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return buildError(ErrorCode.WeakPassword);
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(password)) {
    return buildError(ErrorCode.WeakPassword);
  }

  return null;
}

export function validateRegisterPayload(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { email, password } = req.body;

  const emailError = validateEmail(email);
  if (emailError) {
    res.status(400).json(emailError);
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    res.status(400).json(passwordError);
    return;
  }

  next();
}

export function validateLoginPayload(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { email, password } = req.body;

  const emailError = validateEmail(email);
  if (emailError) {
    res.status(400).json(emailError);
    return;
  }

  if (!password) {
    res.status(400).json(buildError(ErrorCode.MissingPassword));
    return;
  }

  next();
}
