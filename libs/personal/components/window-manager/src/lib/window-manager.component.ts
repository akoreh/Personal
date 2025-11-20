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

import { TerminalAppComponent } from '@po/personal/components/apps/terminal-app';
import { WindowComponent } from '@po/personal/components/window';
import { WindowManagerService } from '@po/personal/state/window';

@Component({
  selector: 'ps-window-manager',
  templateUrl: './window-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, WindowComponent, TerminalAppComponent],
})
export class WindowManagerComponent implements OnInit {
  boundary = input.required<ElementRef<HTMLElement> | HTMLElement>();

  protected readonly windowManagerService = inject(WindowManagerService);

  protected readonly isDev = false;

  readonly underMaintenanceTemplate = viewChild<TemplateRef<any>>(
    'underMaintenanceContent',
  );

  private readonly terminalAppTemplate =
    viewChild<TemplateRef<any>>('terminalApp');

  ngOnInit() {
    const template = this.underMaintenanceTemplate();
    const terminalAppTemplate = this.terminalAppTemplate();

    if (this.isDev && template) {
      this.windowManagerService.openWindow(template, {
        title: 'Maintenance',
        maximizable: false,
        minimizable: false,
        closable: true,
      });
    }

    // if (terminalAppTemplate) {
    //   this.windowManagerService.openWindow(terminalAppTemplate, {
    //     title: 'Terminal',
    //     maximizable: false,
    //     minimizable: true,
    //     closable: true,
    //     icon: 'terminal',
    //   });
    // }
  }
}
