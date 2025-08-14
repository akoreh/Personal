import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '@po/shared/services/local-storage';
import { Observable, firstValueFrom } from 'rxjs';

import { environment } from '@po/personal/environment';

import { LoginCredentials } from '../models/login-credentials.model';
import { LoginResponse } from '../models/login-response.model';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly url = `${environment.api}/auth`;

  private readonly storageKeys = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  };

  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return firstValueFrom(
      this.http.post<LoginResponse>(`${this.url}/login`, credentials),
    );
  }

  logout(): void {
    this.localStorageService.remove(this.storageKeys.accessToken);
    this.localStorageService.remove(this.storageKeys.refreshToken);
  }

  getAccessToken(): string | null {
    return (
      this.localStorageService.get<string>(`${this.storageKeys.accessToken}`) ||
      null
    );
  }

  getRefreshToken(): string | null {
    return (
      this.localStorageService.get<string>(
        `${this.storageKeys.refreshToken}`,
      ) || null
    );
  }
}
