import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-call-stack',
  templateUrl: './call-stack.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallStackComponent {
  readonly stack = input.required<string[]>();
}
