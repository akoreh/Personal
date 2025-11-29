import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

@Component({
  selector: 'ps-battery',
  templateUrl: './battery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  host: {
    class: 'block',
  },
})
export class BatteryComponent {
  readonly level = input(100, { transform: numberAttribute });

  protected readonly fillWidth = computed(() => {
    const level = Math.max(0, Math.min(100, this.level()));

    return (level / 100) * 15;
  });
}
