import { Injectable } from '@angular/core';

import { AppId } from '@po/personal/enums';

import { AppDefinition } from '../models/app-definition.interface';

@Injectable({ providedIn: 'root' })
export class AppRegistryService {
  private readonly apps = new Map<AppId, AppDefinition>();

  registerApp(app: AppDefinition): void {
    this.apps.set(app.id, app);
  }

  registerApps(apps: Array<AppDefinition>): void {
    apps.forEach((app) => this.registerApp(app));
  }

  getApp(id: AppId): AppDefinition {
    return this.apps.get(id)!;
  }

  getAllApps(): AppDefinition[] {
    return Array.from(this.apps.values());
  }
}
