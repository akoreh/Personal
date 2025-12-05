import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputComponent } from '@po/personal/components/input';

@Component({
  selector: 'ps-px-rem-converter',
  templateUrl: './px-rem-converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputComponent],
})
export class PxRemConverterComponent {
  readonly baseFontSize = signal(16);
  readonly pxValue = signal('16');
  readonly remValue = signal('1');

  onPxChange(value: string): void {
    this.pxValue.set(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const rem = (numValue / this.baseFontSize()).toFixed(4);
      this.remValue.set(rem);
    } else {
      this.remValue.set('');
    }
  }

  onRemChange(value: string): void {
    this.remValue.set(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const px = (numValue * this.baseFontSize()).toFixed(2);
      this.pxValue.set(px);
    } else {
      this.pxValue.set('');
    }
  }

  onBaseFontSizeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const newBase = value ? parseFloat(value) : 16;
    this.baseFontSize.set(newBase);

    // Recalculate if px has a value
    const px = parseFloat(this.pxValue());
    if (!isNaN(px)) {
      const rem = (px / newBase).toFixed(4);
      this.remValue.set(rem);
    }
  }

  copyToClipboard(value: string, unit: string): void {
    if (!value) return;
    navigator.clipboard.writeText(`${value}${unit}`);
  }
}
