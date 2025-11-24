import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';
import { SvgIconName } from '@po/personal/services/icon';

@Component({
  selector: 'ps-desktop-icon',
  templateUrl: './desktop-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, IconComponent, CdkDrag],
})
export class DesktopIconComponent {
  static nextId = 0;

  protected readonly id = `ps-desktop-icon-${DesktopIconComponent.nextId++}`;

  readonly name = input.required<string>();
  readonly icon = input.required<SvgIconName>();

  readonly open = output<void>();

  protected readonly isFocused = signal(false);
  protected readonly position = signal({ x: 0, y: 0 });

  protected onFocus(): void {
    this.isFocused.set(true);
  }

  protected onBlur(): void {
    this.isFocused.set(false);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.stopPropagation();
      this.isFocused.set(false);
      this.open.emit();
    }
  }

  protected onDragEnded(event: CdkDragEnd): void {
    const { x, y } = event.source.getFreeDragPosition();
    this.position.set({ x, y });
  }

  protected onClick(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();

    this.isFocused.set(true);
  }

  protected onDoubleClick(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();

    this.isFocused.set(false);

    this.open.emit();
  }
}
