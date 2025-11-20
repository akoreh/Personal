import {
  Injectable,
  Signal,
  TemplateRef,
  computed,
  inject,
} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { WindowConfig } from './window-config.model';
import { AppWindow, WindowsStore } from './window.store';

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  private readonly windowsStore = inject(WindowsStore);

  private readonly templateCache = new Map<string, TemplateRef<any>>();

  readonly windows: Signal<Array<AppWindow & { content: TemplateRef<any> }>> =
    computed(() => {
      const windows = this.windowsStore.windows();

      return windows.map((window) => ({
        ...window,
        content: this.templateCache.get(window.id) as TemplateRef<any>,
      }));
    });

  openWindow(content: TemplateRef<any>, config: WindowConfig): void {
    const id = uuidv4();

    this.templateCache.set(id, content);
    this.windowsStore.openWindow(id, config);
  }

  closeWindow(id: string): void {
    this.windowsStore.closeWindow(id);
    this.templateCache.delete(id);
  }

  focusWindow(id: string): void {
    this.windowsStore.focusWindow(id);
  }

  minimizeWindow(id: string): void {
    this.windowsStore.minimizeWindow(id);
  }

  maximizeWindow(id: string): void {
    this.windowsStore.maximizeWindow(id);
  }

  restoreWindow(id: string): void {
    this.windowsStore.restoreWindow(id);
  }
}
