import { Type } from '@angular/core';

import { AppId } from '@po/personal/enums';
import { SvgIconName } from '@po/personal/services/icon';

import { WindowSize } from '../types/window-size.type';

export interface AppMetadata {
  readonly title: string;
  readonly icon: SvgIconName;
  readonly closable?: boolean;
  readonly minimizable?: boolean;
  readonly maximizable?: boolean;
  readonly size?: WindowSize;
}

export interface AppDefinition {
  id: AppId;
  metadata: AppMetadata;
  loadComponent: () => Promise<Type<any>>;
}
