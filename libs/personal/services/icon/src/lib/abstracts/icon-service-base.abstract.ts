import { Observable } from 'rxjs';

import { SvgIconName } from '../types/types';

export abstract class IconServiceBase {
  abstract getSvgIcon(iconName: SvgIconName): Observable<SVGElement>;
}
