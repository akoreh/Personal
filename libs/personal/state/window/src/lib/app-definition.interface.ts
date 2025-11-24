import { Type } from '@angular/core';

import { SvgIconName } from '@po/personal/services/icon';

export interface AppMetadata {
  readonly appTitle: string;
  readonly appIcon?: SvgIconName;
  readonly appClosable?: boolean;
  readonly appMinimizable?: boolean;
  readonly appMaximizable?: boolean;
}

export interface AppWithMetadata {
  appMetadata: AppMetadata;
}

export interface AppDefinition {
  id: string;
  route: string;
  metadata: AppMetadata;
  loadComponent: () => Promise<Type<any>>;
}
