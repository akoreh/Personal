import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { isNil } from 'lodash-es';

import { LoginCredentials } from '../models/login-credentials.model';
import { AuthService } from '../services/auth.service';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  username: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  email: null,
  username: null,
  isAuthenticated: false,
};

export const AuthStore = signalStore(
  {},
  withState<AuthState>(initialState),
  withProps(() => ({
    authService: inject(AuthService),
  })),
  withMethods((store) => ({
    setAccessToken(accessToken: string): void {
      try {
        const payload = store.authService.decodeJWT(accessToken);

        patchState(store, {
          accessToken,
          email: payload.email,
          username: payload.username,
          isAuthenticated: !isNil(accessToken),
        });
      } catch {
        // If JWT decoding fails, just set the token without user info
        patchState(store, {
          accessToken,
          isAuthenticated: !isNil(accessToken),
        });
      }
    },

    setRefreshToken(refreshToken: string): void {
      patchState(store, (state) => ({
        ...state,
        refreshToken,
      }));
    },
    async login(credentials: LoginCredentials): Promise<void> {
      const { accessToken, refreshToken } =
        await store.authService.login(credentials);

      const payload = store.authService.decodeJWT(accessToken);

      patchState(store, {
        accessToken,
        refreshToken,
        email: payload.email,
        username: payload.username,
        isAuthenticated: true,
      });
    },
  })),
  withHooks({
    onInit(store) {
      const authService = inject(AuthService);

      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();

      if (accessToken) {
        store.setAccessToken(accessToken);
      }

      if (refreshToken) {
        store.setRefreshToken(refreshToken);
      }
    },
  }),
);
