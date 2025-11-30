export type ISODateString = string;
export type Constructor<T> = new (...args: Array<any>) => T;
export type AbstractConstructor<T = object> = abstract new (
  ...args: Array<any>
) => T;
export type nil = null | undefined;
