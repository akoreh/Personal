import { SvgIconName } from '@po/personal/services/icon';

export interface AppMetadata {
  readonly appTitle: string;
  readonly appIcon?: SvgIconName;
  readonly appClosable?: boolean;
  readonly appMinimizable?: boolean;
  readonly appMaximizable?: boolean;
}
