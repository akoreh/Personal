import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';

import { WindowComponent } from '@po/personal/components/window';
import { WindowManagerService } from '@po/personal/state/window';

@Component({
  selector: 'ps-window-manager',
  templateUrl: './window-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WindowComponent],
})
export class WindowManagerComponent {
  boundary = input.required<ElementRef<HTMLElement> | HTMLElement>();

  protected readonly windowManagerService = inject(WindowManagerService);
}
