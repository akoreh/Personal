import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { LoginPayload } from '@po/shared/models';
import { isNil } from 'lodash-es';

import { AuthService } from '../services/auth.service';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  email: null,
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
          userId: payload.userId,
          email: payload.email,
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
    async login(credentials: LoginPayload): Promise<void> {
      const { accessToken, refreshToken, user } =
        await store.authService.login(credentials);

      patchState(store, {
        accessToken,
        refreshToken,
        userId: user.id,
        email: user.email,
        isAuthenticated: true,
      });
    },

    logout(): void {
      store.authService.logout();

      patchState(store, initialState);
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
