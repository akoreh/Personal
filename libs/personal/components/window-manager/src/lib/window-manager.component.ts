import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { WindowComponent } from '@po/personal/components/window';
import { WindowManagerService } from '@po/personal/state/window';

@Component({
  selector: 'ps-window-manager',
  templateUrl: './window-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, WindowComponent],
})
export class WindowManagerComponent implements OnInit {
  boundary = input.required<ElementRef<HTMLElement> | HTMLElement>();

  protected readonly windowManagerService = inject(WindowManagerService);

  protected readonly isDev = true;

  readonly underMaintenanceTemplate = viewChild<TemplateRef<any>>(
    'underMaintenanceContent',
  );

  ngOnInit() {
    const template = this.underMaintenanceTemplate();

    if (this.isDev && template) {
      this.windowManagerService.openWindow(template, {
        title: 'Maintenance',
        maximizable: false,
        minimizable: false,
        closable: true,
      });
    }
  }
}
