import { Injectable, Signal, Type, inject } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

import { AppDefinition } from './app-definition.interface';
import { AppMetadata } from './app-metadata.interface';
import { AppRegistryService } from './app-registry.service';
import { WindowConfig } from './window-config.model';
import { AppWindow, WindowsStore } from './window.store';

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  private readonly windowsStore = inject(WindowsStore);
  private readonly appRegistry = inject(AppRegistryService);
  private readonly router = inject(Router);

  readonly windows: Signal<Array<AppWindow>> = this.windowsStore.windows;

  async openApp(
    appId: string,
    configOverrides?: Partial<WindowConfig>,
    updateUrl = true,
  ): Promise<void> {
    const appDef = this.appRegistry.getApp(appId);
    if (!appDef) {
      console.error(`App not found: ${appId}`);
      return;
    }

    const component = await appDef.loadComponent();
    const id = uuidv4();

    const config: WindowConfig = {
      title: appDef.metadata.appTitle,
      icon: appDef.metadata.appIcon,
      closable: appDef.metadata.appClosable ?? true,
      minimizable: appDef.metadata.appMinimizable ?? true,
      maximizable: appDef.metadata.appMaximizable ?? true,
      ...configOverrides,
    };

    this.windowsStore.openWindow(id, component, config);

    // Update URL with query param (only if not called from resolver)
    if (updateUrl) {
      await this.updateUrlWithOpenApps();
    }
  }

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
    // Check if the component class has a static appMetadata property
    if ('appMetadata' in component && component.appMetadata) {
      return component.appMetadata as AppMetadata;
    }
    return null;
  }

  private async updateUrlWithOpenApps(): Promise<void> {
    const openApps = this.windows()
      .map((w) => {
        const app = this.findAppByComponent(w.component);
        return app?.id;
      })
      .filter((id): id is string => !!id);

    await this.router.navigate([], {
      queryParams: { apps: openApps.length > 0 ? openApps.join(',') : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private findAppByComponent(component: Type<any>): AppDefinition | undefined {
    return this.appRegistry.getAllApps().find((app) => {
      // This is a limitation - we can't easily compare lazy loaded components
      // For now, match by title from metadata
      const metadata = this.getAppMetadata(component);
      return metadata?.appTitle === app.metadata.appTitle;
    });
  }

  async closeWindow(id: string): Promise<void> {
    this.windowsStore.closeWindow(id);
    await this.updateUrlWithOpenApps();
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
