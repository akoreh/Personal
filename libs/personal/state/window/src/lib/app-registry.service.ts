import { Injectable } from '@angular/core';

import { AppDefinition } from './app-definition.interface';

@Injectable({ providedIn: 'root' })
export class AppRegistryService {
  private readonly apps = new Map<string, AppDefinition>();

  registerApp(app: AppDefinition): void {
    this.apps.set(app.id, app);
  }

  registerApps(apps: AppDefinition[]): void {
    apps.forEach((app) => this.registerApp(app));
  }

  getApp(id: string): AppDefinition | undefined {
    return this.apps.get(id);
  }

  getAppByRoute(route: string): AppDefinition | undefined {
    return Array.from(this.apps.values()).find((app) => app.route === route);
  }

  getAllApps(): AppDefinition[] {
    return Array.from(this.apps.values());
  }
}
