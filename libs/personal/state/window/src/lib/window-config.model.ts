import { AppId } from '@po/personal/enums';
import { SvgIconName } from '@po/personal/services/icon';

export interface WindowConfig {
  appId: AppId;
  title: string;
  minimizable: boolean;
  closable: boolean;
  maximizable: boolean;
  icon?: SvgIconName;
  iconImg?: string;
}
