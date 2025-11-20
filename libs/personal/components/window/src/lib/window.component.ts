import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';

@Component({
  selector: 'ps-window',
  templateUrl: 'window.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, CdkDrag, CdkDragHandle, NgClass],
})
export class WindowComponent {
  readonly title = input<string | undefined>();
  readonly closable = input(false, { transform: booleanAttribute });
  readonly minimizable = input(false, { transform: booleanAttribute });
  readonly maximizable = input(false, { transform: booleanAttribute });
  readonly minimized = input(false, { transform: booleanAttribute });
  readonly maximized = input(false, { transform: booleanAttribute });
  readonly zIndex = input<number>(1);
  readonly dragBoundary = input.required<
    ElementRef<HTMLElement> | HTMLElement
  >();

  readonly closeWindow = output<void>();
  readonly minimizeWindow = output<void>();
  readonly maximizeWindow = output<void>();
  readonly restoreWindow = output<void>();
  readonly focusWindow = output<void>();

  protected readonly hasControls = computed(
    () => this.minimizable() || this.maximizable() || this.closable(),
  );

  onClose(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();

    this.closeWindow.emit();
  }

  onMinimize(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();

    this.minimizeWindow.emit();
  }

  onMaximize(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();

    if (this.maximized()) {
      this.restoreWindow.emit();
    } else {
      this.maximizeWindow.emit();
    }
  }

  onFocus(): void {
    this.focusWindow.emit();
  }
}
