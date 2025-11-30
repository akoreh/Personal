import { SvgIconName } from '@po/personal/services/icon';

export interface AppMetadata {
  readonly title: string;
  readonly icon?: SvgIconName;
  readonly closable?: boolean;
  readonly minimizable?: boolean;
  readonly maximizable?: boolean;
}

export interface AppWithMetadata {
  appMetadata: AppMetadata;
}
