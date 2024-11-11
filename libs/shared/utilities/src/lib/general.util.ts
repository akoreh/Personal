import { isArray, isNil, isObject } from 'lodash-es';
import { Observable, from } from 'rxjs';

export const clamp = (number: number, lower: number, upper: number): number =>
  Math.min(Math.max(number, lower), upper);

export const deepClone = <T>(value: T): T =>
  isObject(value) ? JSON.parse(JSON.stringify(value)) : value;

export const isPrimitive = (value: any): boolean => {
  const type = typeof value;

  return value === null || (type !== 'object' && type !== 'function');
};

export const hasOwnProperty = <T>(obj: T, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);

export const normalizeWhiteSpace = (value: string): string =>
  value.replace(/\s\s+/g, ' ');

export const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

export const replaceAll = (
  str: string,
  find: string,
  replace: string,
): string => str.replace(new RegExp(escapeRegExp(find), 'g'), replace);

/**
 *
 * @param array Original array
 * @param item New item
 * @param predicate Callback function used to find the item to be replaced with the new item
 * @returns A new array (not mutating the original one) with the first item the predicate callback returned true for having been replaced with the new item
 */
export const replaceInArray = <T>(
  array: Array<T>,
  item: T,
  predicate: (item: T) => boolean,
): Array<T> => {
  if (isNil(array) || !isArray(array)) {
    return [];
  }

  const newArray = [...array];
  const index = newArray.findIndex(predicate);

  if (index !== -1) {
    newArray.splice(index, 1, item);
  }

  return newArray;
};

export const byAnimation = (id: string): string => `[data-animation="${id}"]`;

export const stripQueryParams = (url: string): string => {
  if (url.includes('http')) {
    const { origin, pathname } = new URL(url);

    return `${origin}${pathname}`;
  }

  return url;
};

export const getVerticalDistance = (
  el1: HTMLElement,
  el2: HTMLElement,
): number => {
  const { bottom } = el1.getBoundingClientRect();
  const { top } = el2.getBoundingClientRect();

  return Math.abs(top - bottom);
};

export const getHorizontalDistance = (
  el1: HTMLElement,
  el2: HTMLElement,
): number => {
  const { right } = el1.getBoundingClientRect();
  const { left } = el2.getBoundingClientRect();

  return Math.abs(left - right);
};

export const mockRequest = <T>(value?: T): Observable<T> =>
  from(
    new Promise((resolve) => {
      resolve(value);
    }),
  ) as Observable<T>;

export const mockFailedRequest = <T>(error?: any): Observable<T> =>
  from(
    new Promise((_, reject) => {
      reject(error);
    }),
  ) as Observable<T>;

export const orderSort = <T>(
  order: Array<T>,
  arrayToSort: Array<T>,
): Array<T> => {
  const orderMap = new Map<T, number>();

  order.forEach((item, index) => orderMap.set(item, index));

  const sort = (a: T, b: T): number => {
    const indexA = orderMap.get(a);
    const indexB = orderMap.get(b);

    if (!isNil(indexA) && !isNil(indexB)) {
      return indexA - indexB;
    }

    if (!isNil(indexA)) {
      return -1;
    }

    if (!isNil(indexB)) {
      return 1;
    }

    return arrayToSort.indexOf(a) - arrayToSort.indexOf(b);
  };

  return [...arrayToSort].sort(sort);
};

/**
 * Determines if the current device has a safe area at the bottom.
 * For example, on an iphone, when the app is opened in the browser,
 * the URL bar is at the bottom of the screen, providing what's called a "safe area".
 * If this is not present, then this method returns false
 */
export const hasBottomSafeArea = (): boolean => {
  const safeAreaBottom = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--sab')
      .replace('px', ''),
    10,
  );

  return safeAreaBottom === 0;
};
