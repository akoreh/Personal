import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { remove } from 'lodash-es';

import { WindowConfig } from './window-config.model';

export interface AppWindow extends WindowConfig {
  id: string;
  minimized: boolean;
}

interface WindowsState {
  windows: Array<AppWindow>;
}

const initialState: WindowsState = {
  windows: [],
};

export const WindowsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    openWindow(id: string, config: WindowConfig): void {
      const window = { id, minimized: false, ...config };

      patchState(store, (state) => ({
        ...state,
        windows: [...state.windows, window],
      }));
    },
    closeWindow(id: string): void {
      patchState(store, (state) => {
        const windows = [...state.windows];

        remove(windows, { id });

        return { ...state, windows };
      });
    },
  })),
);
