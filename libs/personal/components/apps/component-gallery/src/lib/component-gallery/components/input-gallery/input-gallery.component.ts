import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { InputComponent } from '@po/personal/components/input';

@Component({
  selector: 'ps-input-gallery',
  templateUrl: './input-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponent],
})
export class InputGalleryComponent {
  readonly textValue = signal('');
  readonly passwordValue = signal('');
  readonly numberValue = signal('');
  readonly doubleValue = signal('');
  readonly disabledValue = signal('Disabled input');
  readonly numberWithMinValue = signal('');
  readonly numberWithMaxValue = signal('');
  readonly numberWithRangeValue = signal('');

  getValueType(value: string | number): string {
    return typeof value;
  }
}
