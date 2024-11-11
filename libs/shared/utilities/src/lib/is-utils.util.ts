import { isEmpty, isString } from 'lodash-es';

export const isEmptyString = (value: unknown): boolean =>
  isString(value) && isEmpty(value.trim());

export const isBooleanString = (value: string): boolean =>
  value === 'true' || value === 'false';

export const isNumberString = (value: string): boolean =>
  /^-?\d*\.?\d+$/.test(value);
