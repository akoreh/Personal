import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
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
  imports: [IconComponent, CdkDrag, CdkDragHandle],
})
export class WindowComponent {
  title = input<string | undefined>();
  closable = input(false, { transform: booleanAttribute });
  minimizable = input(false, { transform: booleanAttribute });
  maximizable = input(false, { transform: booleanAttribute });
  dragBoundary = input.required<ElementRef<HTMLElement> | HTMLElement>();

  close = output<void>();

  protected readonly hasControls = computed(
    () => this.minimizable() || this.maximizable() || this.closable(),
  );

  onClose(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();

    this.close.emit();
  }
}
