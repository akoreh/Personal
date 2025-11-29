import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
} from '@angular/core';

import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[psTooltip]',
})
export class TooltipDirective implements OnDestroy {
  readonly psTooltip = input.required<string>();

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef);

  private overlayRef: OverlayRef | null = null;
  private tooltipRef: ComponentRef<TooltipComponent> | null = null;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.show();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hide();
  }

  @HostListener('focus')
  onFocus(): void {
    this.show();
  }

  @HostListener('blur')
  onBlur(): void {
    this.hide();
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private show(): void {
    if (this.overlayRef) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8,
        },
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    const portal = new ComponentPortal(TooltipComponent);
    this.tooltipRef = this.overlayRef.attach(portal);
    this.tooltipRef.setInput('text', this.psTooltip());
  }

  private hide(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.tooltipRef = null;
    }
  }
}
