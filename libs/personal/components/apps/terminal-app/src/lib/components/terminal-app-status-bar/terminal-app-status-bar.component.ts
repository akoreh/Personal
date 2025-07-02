import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-terminal-app-status-bar',
  templateUrl: './terminal-app-status-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalAppStatusBarComponent {
  readonly path = input.required<string>();
}
