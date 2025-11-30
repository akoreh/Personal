import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';

import { AppId } from '@po/personal/enums';
import { WindowManagerService } from '@po/personal/state/window';

const openAppsResolver: ResolveFn<boolean> = async (
  route: ActivatedRouteSnapshot,
) => {
  const windowManager = inject(WindowManagerService);

  const appsParam = route.queryParams['apps'];
  const appIds = appsParam ? appsParam.split(',').filter(Boolean) : [];

  if (appIds.length > 0) {
    await Promise.all(appIds.map((id: AppId) => windowManager.openApp(id)));
  }

  return true;
};

export const appRoutes: Routes = [
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
