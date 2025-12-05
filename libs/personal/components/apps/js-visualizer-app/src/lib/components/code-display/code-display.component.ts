import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-code-display',
  templateUrl: './code-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeDisplayComponent {
  readonly code = input.required<string>();
}
