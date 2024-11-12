import { Injectable } from '@angular/core';
import { isObject, noop } from 'lodash-es';

@Injectable()
export class LocalStorageService {
  get<T>(key: string): T | undefined {
    const data = window.localStorage.getItem(key);

    if (data) {
      if (this.isStringifiedJson(data)) {
        return JSON.parse(data as string);
      }

      return data as T;
    }

    return undefined;
  }

  set(key: string, value: any): void {
    if (isObject(value)) {
      const stringified = JSON.stringify(value);

      window.localStorage.setItem(key, stringified);
    } else {
      window.localStorage.setItem(key, value);
    }
  }

  remove(key: string): void {
    window.localStorage.removeItem(key);
  }

  private isStringifiedJson(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    try {
      const result = JSON.parse(value);
      const type = Object.prototype.toString.call(result);

      return type === '[object Object]';
    } catch (err) {
      noop(err);
      return false;
    }
  }
}
