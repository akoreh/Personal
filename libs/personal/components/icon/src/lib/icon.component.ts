import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  effect,
  inject,
  input,
  resource,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { lastValueFrom } from 'rxjs';

import { IconService, SvgIconName } from '@po/personal/services/icon';

@UntilDestroy()
@Component({
  selector: 'ps-icon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @HostBinding('class.block')
  readonly block = true;

  @HostBinding('attr.aria-hidden')
  readonly ariaHidden = 'true';

  readonly icon = input.required<SvgIconName>();
  readonly fill = input<string>('');

  constructor() {
    effect(() => {
      const icon = this.iconResource.value();

      if (this.icon() === 'trash') {
        console.log('icon', icon);
      }

      if (icon) {
        if (this.fill()) {
          icon.setAttribute('fill', this.fill());
        }

        this.setSvg(icon);
      }
    });
  }

  private readonly iconResource = resource({
    request: () => ({ icon: this.icon() }),
    loader: ({ request }) =>
      lastValueFrom(this.iconService.getSvgIcon(request.icon)),
  });

  private readonly elementRef = inject(ElementRef) as ElementRef<HTMLElement>;

  private readonly iconService = inject(IconService);

  private setSvg(svg: SVGElement): void {
    const host = this.elementRef.nativeElement;

    if (this.icon() === 'trash') {
      console.log('host', host);
    }

    if (host.firstChild) {
      host.replaceChild(svg, host.firstChild);
    }

    host.appendChild(svg);
  }
}
