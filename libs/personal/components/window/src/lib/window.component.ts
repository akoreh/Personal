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
import { WindowSize } from '@po/personal/state/window';

@Component({
  selector: 'ps-window',
  templateUrl: 'window.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, CdkDrag, CdkDragHandle, NgClass, NgComponentOutlet],
})
export class WindowComponent implements AfterViewInit {
  readonly title = input<string | undefined>();
  readonly component = input.required<Type<any>>();
  readonly size = input<WindowSize>('md');
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

  protected readonly windowWidth = computed(() => {
    const size = this.size();
    const widthMap: Record<WindowSize, string> = {
      sm: 'min(20rem, 90vw)',
      md: 'min(30rem, 90vw)',
      lg: 'min(40rem, 90vw)',
      xl: 'min(50rem, 90vw)',
    };
    return widthMap[size];
  });

  protected readonly windowHeight = computed(() => {
    const size = this.size();
    const heightMap: Record<WindowSize, string> = {
      sm: 'min(16rem, 50vh)',
      md: 'min(24rem, 60vh)',
      lg: 'min(30rem, 65vh)',
      xl: 'min(36rem, 70vh)',
    };
    return heightMap[size];
  });

  private readonly windowElement = viewChild<ElementRef>('windowElement');
  protected readonly initialPosition = signal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  ngAfterViewInit(): void {
    const element = this.windowElement()?.nativeElement;
    if (!element) return;

    const boundary = this.dragBoundary();
    const boundaryElement =
      boundary instanceof ElementRef ? boundary.nativeElement : boundary;

    const boundaryRect = boundaryElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const centerX = (boundaryRect.width - elementRect.width) / 2;
    const centerY = (boundaryRect.height - elementRect.height) / 2;

    this.initialPosition.set({ x: centerX, y: centerY });
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
