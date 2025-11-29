import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  DecodedAuthToken,
  LoginPayload,
  LoginResponse,
} from '@po/shared/models';
import { LocalStorageService } from '@po/shared/services/local-storage';
import { firstValueFrom, tap } from 'rxjs';

import { environment } from '@po/personal/environment';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly url = `${environment.api}/auth`;

  private readonly storageKeys = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  };

  login(credentials: LoginPayload): Promise<LoginResponse> {
    return firstValueFrom(
      this.http.post<LoginResponse>(`${this.url}/login`, credentials).pipe(
        tap(({ accessToken, refreshToken }) => {
          this.localStorageService.set(
            this.storageKeys.accessToken,
            accessToken,
          );
          this.localStorageService.set(
            this.storageKeys.refreshToken,
            refreshToken,
          );
        }),
      ),
    );
  }

  logout(): void {
    this.localStorageService.remove(this.storageKeys.accessToken);
    this.localStorageService.remove(this.storageKeys.refreshToken);
  }

  getAccessToken(): string | null {
    return (
      this.localStorageService.get<string>(this.storageKeys.accessToken) || null
    );
  }

  getRefreshToken(): string | null {
    return (
      this.localStorageService.get<string>(this.storageKeys.refreshToken) ||
      null
    );
  }

  /**
   * Decodes a JWT token payload without verifying the signature
   * @param token - The JWT token to decode
   * @returns The decoded payload object
   */
  decodeJWT(token: string): DecodedAuthToken {
    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }

      // Get the payload (second part)
      const payload = parts[1];

      // Add padding if needed
      const paddedPayload = payload + '==='.slice((payload.length + 3) % 4);

      // Decode base64
      const decodedPayload = atob(paddedPayload);

      // Parse JSON
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error(
        `Failed to decode JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Checks if a JWT token is expired
   * @param token - The JWT token to check
   * @returns True if the token is expired, false otherwise
   */
  isJWTExpired(token: string): boolean {
    try {
      const payload = this.decodeJWT(token);

      if (!payload.exp) {
        return false; // No expiration claim
      }

      // JWT exp is in seconds, Date.now() is in milliseconds
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true; // If we can't decode it, consider it expired
    }
  }
}
