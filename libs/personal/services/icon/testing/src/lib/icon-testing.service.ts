import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { IconServiceBase, SvgIconName } from '@po/personal/services/icon';

@Injectable()
export class IconTestingService implements IconServiceBase {
  constructor(private readonly testId: string) {}

  getSvgIcon(iconName: SvgIconName): Observable<SVGElement> {
    return of(this.composeSvgElement(iconName));
  }

  private readonly composeSvgElement = (iconName: SvgIconName): SVGElement => {
    const div = document.createElement('div');

    div.innerHTML = `<svg data-testid="${this.testId}">${iconName}</svg>`;

    return div.querySelector('svg') as SVGElement;
  };
}
