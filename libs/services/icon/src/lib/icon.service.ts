import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  Subject,
  distinct,
  filter,
  first,
  map,
  mergeMap,
  of,
} from 'rxjs';

import { SvgIconName } from './types/types';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor() {
    this.initLoadingBufferHandler();
  }

  private readonly document: Document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);

  private readonly cache: Partial<Record<SvgIconName, SVGElement>> = {};

  private readonly loadingBuffer$ = new Subject<SvgIconName>();

  private readonly svgLoaded$ = new Subject<{
    iconName: SvgIconName;
    svg: SVGElement;
  }>();

  getSvgIcon(svgIconName: SvgIconName): Observable<SVGElement> {
    if (this.cache[svgIconName]) {
      const svg = this.cloneSvg(this.cache[svgIconName] as SVGElement);

      return of(svg);
    }

    this.loadingBuffer$.next(svgIconName);

    return this.svgLoaded$.pipe(
      filter(({ iconName }) => iconName === svgIconName),
      map((res) => res.svg),
      first(),
    );
  }

  private initLoadingBufferHandler(): void {
    this.loadingBuffer$
      .pipe(
        distinct(),
        mergeMap((iconName) =>
          this.loadSvg(iconName).pipe(
            first(),
            map((svg) => ({ svg, iconName })),
          ),
        ),
      )
      .subscribe({
        next: ({ svg, iconName }) => {
          this.cache[iconName] = svg;

          this.svgLoaded$.next({
            iconName,
            svg: this.cloneSvg(svg),
          });
        },
      });
  }

  private cloneSvg(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
  }

  private loadSvg(svgIcon: SvgIconName): Observable<SVGElement> {
    return this.http
      .get(`assets/icons/${svgIcon}.svg`, {
        responseType: 'text',
      })
      .pipe(map((text) => this.composeSvgElement(text)));
  }

  private composeSvgElement(svgText: string): SVGElement {
    const div = this.document.createElement('div');

    div.innerHTML = svgText;

    return div.querySelector('svg') as SVGElement;
  }
}
