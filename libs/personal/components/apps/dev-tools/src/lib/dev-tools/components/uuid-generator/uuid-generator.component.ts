import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { ButtonComponent } from '@po/personal/components/button';
import { InputComponent } from '@po/personal/components/input';

@Component({
  selector: 'ps-uuid-generator',
  templateUrl: './uuid-generator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, InputComponent],
})
export class UuidGeneratorComponent {
  readonly generatedUuids = signal<string[]>([]);
  readonly count = signal(1);

  generate(): void {
    const newUuids = Array.from({ length: this.count() }, () => uuidv4());
    this.generatedUuids.update((existing) => [...newUuids, ...existing]);
  }

  clear(): void {
    this.generatedUuids.set([]);
  }

  copyToClipboard(uuid: string): void {
    navigator.clipboard.writeText(uuid);
  }

  copyAll(): void {
    const all = this.generatedUuids().join('\n');
    navigator.clipboard.writeText(all);
  }

  onCountChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.count.set(Math.max(1, Math.min(100, parseInt(value) || 1)));
  }

  removeUuid(index: number): void {
    this.generatedUuids.update((uuids) => uuids.filter((_, i) => i !== index));
  }
}
