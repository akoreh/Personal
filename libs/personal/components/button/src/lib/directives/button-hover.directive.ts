import {
  Directive,
  ElementRef,
  Renderer2,
  inject,
  output,
} from '@angular/core';

import { ButtonHoverPosition } from '../types/button.type';

@Directive({
  selector: 'button[psButton]',
  host: {
    '(mousedown)': 'onMouseDown()',
    '(mouseup)': 'onMouseUp()',
    '(mousemove)': 'onMouseMove($event)',
    '(mouseEnter)': 'onMouseMove($event)',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class ButtonDirective {
  readonly clicked = output<void>();

  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  private readonly activeClass = 'btn-active';
  private previousHoverClass?: ButtonHoverPosition;

  private get disabled(): boolean {
    return this.elementRef.nativeElement?.disabled;
  }

  protected onMouseDown(): void {
    if (this.disabled) {
      return;
    }

    this.addClass(this.activeClass);
  }

  protected onMouseUp(): void {
    this.removeClass(this.activeClass);

    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  protected onMouseLeave(): void {
    this.removePreviousHoverClass();
    this.removeClass(this.activeClass);
  }

  protected onMouseMove(event: MouseEvent): void {
    const disabled = this.elementRef.nativeElement?.disabled;

    if (disabled) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const btnWidth = target.offsetWidth;
    const mouseX = event.clientX - rect.left;

    let newClass: ButtonHoverPosition;

    if (mouseX < btnWidth * 0.3) {
      newClass = 'hover-left';
    } else if (mouseX > btnWidth * 0.65) {
      newClass = 'hover-right';
    } else {
      newClass = 'hover-center';
    }

    if (newClass !== this.previousHoverClass) {
      this.setNewHoverClass(newClass);
    }
  }

  private removePreviousHoverClass(): void {
    if (this.previousHoverClass) {
      this.removeClass(this.previousHoverClass);
    }
  }

  private setNewHoverClass(className: ButtonHoverPosition): void {
    this.removePreviousHoverClass();

    this.previousHoverClass = className;

    this.addClass(className);
  }

  private removeClass(className: string): void {
    this.renderer.removeClass(this.elementRef.nativeElement, className);
  }

  private addClass(className: string): void {
    this.renderer.addClass(this.elementRef.nativeElement, className);
  }
}
