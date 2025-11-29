import { AppId } from '@po/personal/enums';
import { SvgIconName } from '@po/personal/services/icon';

export interface DockItem {
  icon: SvgIconName;
  link?: string;
  appId?: AppId;
}
