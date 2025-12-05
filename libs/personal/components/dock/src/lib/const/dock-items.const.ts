import { AppId } from '@po/personal/enums';

import { DockItem } from '../models/dock-item.model';

export const dockItems: Array<DockItem> = [
  {
    icon: 'github',
    link: 'https://github.com/akoreh/Personal/tree/main',
    tooltip: 'GitHub',
  },
  {
    icon: 'linkedin',
    link: 'https://www.linkedin.com/in/andrei-koreh-71084b169/',
    tooltip: 'LinkedIn',
  },
  {
    icon: 'envelope',
    link: 'mailto:korehdev@gmail.com',
    tooltip: 'Email',
  },
  {
    icon: 'terminal',
    appId: AppId.Terminal,
    tooltip: 'Terminal',
  },
  {
    icon: 'cube',
    appId: AppId.ComponentGallery,
    tooltip: 'Component Gallery',
  },
  {
    icon: 'code',
    appId: AppId.DevTools,
    tooltip: 'Dev Tools',
  },
];
