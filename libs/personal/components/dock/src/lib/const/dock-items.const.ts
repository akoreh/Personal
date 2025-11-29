import { AppId } from '@po/personal/enums';

import { DockItem } from '../models/dock-item.model';

export const dockItems: Array<DockItem> = [
  {
    icon: 'github',
    link: 'https://github.com/akoreh/Personal/tree/main',
  },
  {
    icon: 'linkedin',
    link: 'https://www.linkedin.com/in/andrei-koreh-71084b169/',
  },
  {
    icon: 'envelope',
    link: 'mailto:korehdev@gmail.com',
  },
  {
    icon: 'terminal',
    appId: AppId.Terminal,
  },
];
