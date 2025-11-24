import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';

import { WindowManagerService } from '@po/personal/state/window';

const openAppsResolver: ResolveFn<boolean> = async (
  route: ActivatedRouteSnapshot,
) => {
  const windowManager = inject(WindowManagerService);

  // Get apps from query params
  const appsParam = route.queryParams['apps'];
  const appIds = appsParam ? appsParam.split(',').filter(Boolean) : [];

  // Open each app and wait for all to complete
  // Don't update URL since we're already loading from URL
  if (appIds.length > 0) {
    await Promise.all(
      appIds.map((id: string) => windowManager.openApp(id, {}, false)),
    );
  }

  return true;
};

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@po/personal/components/desktop-manager').then(
        (m) => m.DesktopManagerComponent,
      ),
    resolve: {
      apps: openAppsResolver,
    },
  },
];
