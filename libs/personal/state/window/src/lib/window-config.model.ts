import { SvgIconName } from '@po/personal/services/icon';

export interface WindowConfig {
  title: string;
  minimizable: boolean;
  closable: boolean;
  maximizable: boolean;
  icon?: SvgIconName;
  iconImg?: string;
}
