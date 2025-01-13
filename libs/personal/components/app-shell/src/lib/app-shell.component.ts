import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { IconComponent } from '@po/personal/components/icon';
import { SvgIconName } from '@po/personal/services/icon';

@Component({
  selector: 'ps-app-shell',
  templateUrl: './app-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class AppShellComponent {
  icon = input.required<SvgIconName>();
  name = input.required<string>();

  open = output<void>();

  onDoubleClick(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();

    this.open.emit();
  }
}
