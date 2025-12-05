import { AppId } from '@po/personal/enums';
import { SvgIconName } from '@po/personal/services/icon';

import { WindowSize } from '../types/window-size.type';

export interface WindowConfig {
  appId: AppId;
  title: string;
  minimizable: boolean;
  closable: boolean;
  maximizable: boolean;
  icon?: SvgIconName;
  iconImg?: string;
  size?: WindowSize;
}
