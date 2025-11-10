import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly isBrowser = typeof window !== 'undefined';

  getItem<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      throw new Error('Unable to write to localStorage');
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch {
      // noop
    }
  }

  clear(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.clear();
    } catch {
      // noop
    }
  }
}
