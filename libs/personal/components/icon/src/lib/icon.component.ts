import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  inject,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isNil } from 'lodash-es';

import {
  IconService,
  SVG_ICON_NAMES,
  SvgIconName,
} from '@po/personal/services/icon';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'ps-icon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @HostBinding('attr.aria-hidden')
  readonly ariaHidden = 'true';

  @Input({ required: true })
  set icon(_icon: SvgIconName) {
    this._icon = _icon;

    if (!isNil(_icon) && SVG_ICON_NAMES.includes(_icon)) {
      this.onIconChange(_icon);
    }
  }

  get icon(): SvgIconName {
    return this._icon;
  }

  @Input({ required: false }) fill!: string;

  private readonly elementRef = inject(ElementRef) as ElementRef<HTMLElement>;

  private readonly iconService = inject(IconService);

  private _icon: SvgIconName = '' as any;

  private onIconChange(iconName: SvgIconName): void {
    this.iconService
      .getSvgIcon(iconName)
      .pipe(untilDestroyed(this))
      .subscribe((icon) => {
        if (this.fill) {
          icon.setAttribute('fill', this.fill);
        }

        this.setSvg(icon);
      });
  }

  private setSvg(svg: SVGElement): void {
    const host = this.elementRef.nativeElement;

    if (host.firstChild) {
      host.replaceChild(svg, host.firstChild);
    }

    host.appendChild(svg);
  }
}
