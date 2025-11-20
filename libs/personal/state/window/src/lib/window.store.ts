import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { remove } from 'lodash-es';

import { WindowConfig } from './window-config.model';

export interface AppWindow extends WindowConfig {
  id: string;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

interface WindowsState {
  windows: Array<AppWindow>;
  nextZIndex: number;
}

const initialState: WindowsState = {
  windows: [],
  nextZIndex: 1,
};

export const WindowsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    openWindow(id: string, config: WindowConfig): void {
      const window: AppWindow = {
        id,
        minimized: false,
        maximized: false,
        zIndex: store.nextZIndex(),
        ...config,
      };

      patchState(store, (state) => ({
        ...state,
        windows: [...state.windows, window],
        nextZIndex: state.nextZIndex + 1,
      }));
    },
    closeWindow(id: string): void {
      patchState(store, (state) => {
        const windows = [...state.windows];

        remove(windows, { id });

        return { ...state, windows };
      });
    },
    focusWindow(id: string): void {
      patchState(store, (state) => {
        const windows = state.windows.map((window) =>
          window.id === id ? { ...window, zIndex: state.nextZIndex } : window,
        );

        return { ...state, windows, nextZIndex: state.nextZIndex + 1 };
      });
    },
    minimizeWindow(id: string): void {
      patchState(store, (state) => {
        const windows = state.windows.map((window) =>
          window.id === id ? { ...window, minimized: true } : window,
        );

        return { ...state, windows };
      });
    },
    maximizeWindow(id: string): void {
      patchState(store, (state) => {
        const windows = state.windows.map((window) =>
          window.id === id
            ? { ...window, maximized: true, minimized: false }
            : window,
        );

        return { ...state, windows };
      });
    },
    restoreWindow(id: string): void {
      patchState(store, (state) => {
        const windows = state.windows.map((window) =>
          window.id === id
            ? { ...window, maximized: false, minimized: false }
            : window,
        );

        return { ...state, windows };
      });
    },
  })),
);
