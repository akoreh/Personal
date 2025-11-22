import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { NgClass, NgComponentOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Type,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';

@Component({
  selector: 'ps-window',
  templateUrl: 'window.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, CdkDrag, CdkDragHandle, NgClass, NgComponentOutlet],
})
export class WindowComponent implements AfterViewInit {
  readonly title = input<string | undefined>();
  readonly component = input.required<Type<any>>();
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

  private readonly windowElement = viewChild<ElementRef>('windowElement');
  protected readonly initialPosition = signal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  ngAfterViewInit(): void {
    // Center the window on first render
    const element = this.windowElement()?.nativeElement;
    if (!element) return;

    console.log(this.dragBoundary);

    const boundary = this.dragBoundary();
    const boundaryElement =
      boundary instanceof ElementRef ? boundary.nativeElement : boundary;

    const boundaryRect = boundaryElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const centerX = (boundaryRect.width - elementRect.width) / 2;
    const centerY = (boundaryRect.height - elementRect.height) / 2;

    this.initialPosition.set({ x: centerX, y: centerY });
    console.log(this.initialPosition());
  }

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
