import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-tooltip',
  template: `
    <div
      class="bg-window-border text-background rounded px-2 py-1 text-xs shadow-lg"
      data-testid="tooltip"
    >
      {{ text() }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class TooltipComponent {
  readonly text = input.required<string>();
}
