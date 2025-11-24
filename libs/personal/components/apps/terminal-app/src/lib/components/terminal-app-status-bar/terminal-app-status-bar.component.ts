import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ISODateString } from '@po/shared/models';

@Component({
  selector: 'ps-terminal-app-status-bar',
  templateUrl: './terminal-app-status-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
})
export class TerminalAppStatusBarComponent {
  readonly path = input.required<string>();
  readonly date = input.required<ISODateString>();
}
