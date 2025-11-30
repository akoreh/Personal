import { Injectable, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

import { AppId } from '@po/personal/enums';

import { AppRegistryService } from './app-registry.service';
import { WindowConfig } from './window-config.model';
import { AppWindow, WindowsStore } from './window.store';

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  private readonly windowsStore = inject(WindowsStore);
  private readonly appRegistry = inject(AppRegistryService);
  private readonly router = inject(Router);

  readonly windows: Signal<Array<AppWindow>> = this.windowsStore.windows;

  async openApp(appId: AppId, opts?: { updateUrl: boolean }): Promise<void> {
    const alreadyOpen = this.windowsStore
      .windows()
      .find((window) => window.appId === appId);

    if (alreadyOpen) {
      return this.windowsStore.focusWindow(alreadyOpen.id);
    }

    const appDef = this.appRegistry.getApp(appId);

    if (!appDef) {
      console.error(`App not found: ${appId}`);
      return;
    }

    const component = await appDef.loadComponent();
    const id = uuidv4();

    const config: WindowConfig = {
      appId,
      title: appDef.metadata.title,
      icon: appDef.metadata.icon,
      closable: appDef.metadata.closable ?? true,
      minimizable: appDef.metadata.minimizable ?? true,
      maximizable: appDef.metadata.maximizable ?? true,
    };

    this.windowsStore.openWindow(id, component, config);

    if (opts?.updateUrl) {
      // await this.updateUrlWithOpenApps();
    }
  }

  // private async updateUrlWithOpenApps(): Promise<void> {
  //   const openApps = this.windows()
  //     .map((w) => {
  //       const app = this.findAppByComponent(w.component);
  //       return app?.id;
  //     })
  //     .filter((id): id is string => !!id);

  //   await this.router.navigate([], {
  //     queryParams: { apps: openApps.length > 0 ? openApps.join(',') : null },
  //     queryParamsHandling: 'merge',
  //     replaceUrl: true,
  //   });
  // }

  async closeWindow(id: string): Promise<void> {
    this.windowsStore.closeWindow(id);
    // await this.updateUrlWithOpenApps();
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
