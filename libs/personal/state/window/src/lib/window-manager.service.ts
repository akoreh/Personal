import { Injectable, Signal, Type, inject } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { AppMetadata } from './app-metadata.interface';
import { WindowConfig } from './window-config.model';
import { AppWindow, WindowsStore } from './window.store';

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  private readonly windowsStore = inject(WindowsStore);

  readonly windows: Signal<Array<AppWindow>> = this.windowsStore.windows;

  openWindow(
    component: Type<any>,
    configOverrides?: Partial<WindowConfig>,
  ): void {
    const id = uuidv4();

    // Get app metadata from the component class if it implements AppMetadata
    const metadata = this.getAppMetadata(component);

    // Merge app metadata with overrides
    const config: WindowConfig = {
      title: metadata?.appTitle ?? 'Untitled',
      icon: metadata?.appIcon,
      closable: metadata?.appClosable ?? true,
      minimizable: metadata?.appMinimizable ?? true,
      maximizable: metadata?.appMaximizable ?? true,
      ...configOverrides,
    };

    this.windowsStore.openWindow(id, component, config);
  }

  private getAppMetadata(component: Type<any>): AppMetadata | null {
    // Check if the component class has the metadata properties
    const prototype = component.prototype;
    if (
      prototype &&
      'appTitle' in prototype &&
      typeof prototype.appTitle === 'string'
    ) {
      return {
        appTitle: prototype.appTitle,
        appIcon: prototype.appIcon,
        appClosable: prototype.appClosable,
        appMinimizable: prototype.appMinimizable,
        appMaximizable: prototype.appMaximizable,
      };
    }
    return null;
  }

  closeWindow(id: string): void {
    this.windowsStore.closeWindow(id);
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
