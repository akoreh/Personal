import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-task-queue',
  templateUrl: './task-queue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskQueueComponent {
  readonly title = input.required<string>();
  readonly queue = input.required<string[]>();
  readonly titleColor = input<string>('text-ps-primary-blue');
  readonly itemBgColor = input<string>('bg-ps-secondary-blue');
}
