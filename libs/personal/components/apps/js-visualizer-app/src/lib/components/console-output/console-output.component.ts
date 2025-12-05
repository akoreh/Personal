import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-console-output',
  templateUrl: './console-output.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleOutputComponent {
  readonly output = input.required<string[]>();
}
