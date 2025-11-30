import { isNil, isString } from 'lodash-es';

export function validatePassword(password: string): boolean {
  if (isNil(password) || !isString(password)) {
    return false;
  }

  if (password.length < 8) {
    return false;
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return false;
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(password)) {
    return false;
  }

  return true;
}
