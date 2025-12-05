import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { ButtonComponent } from '@po/personal/components/button';

import { CallStackComponent } from './components/call-stack/call-stack.component';
import { CodeDisplayComponent } from './components/code-display/code-display.component';
import { ConsoleOutputComponent } from './components/console-output/console-output.component';
import { TaskQueueComponent } from './components/task-queue/task-queue.component';
import { JsExecutionService } from './services/js-execution.service';

@Component({
  selector: 'ps-js-engine-app',
  imports: [
    ButtonComponent,
    CallStackComponent,
    TaskQueueComponent,
    ConsoleOutputComponent,
    CodeDisplayComponent,
  ],
  templateUrl: './js-engine-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsEngineAppComponent {
  private readonly executionService = inject(JsExecutionService);

  readonly state = this.executionService.state;
  readonly currentDescription = this.executionService.currentDescription;
  readonly canStepForward = this.executionService.canStepForward;
  readonly canStepBackward = this.executionService.canStepBackward;

  readonly isPlaying = signal(false);
  private playInterval: number | null = null;

  readonly code = `console.log(1);

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});`;

  stepForward(): void {
    this.executionService.stepForward();
  }

  stepBackward(): void {
    this.executionService.stepBackward();
  }

  play(): void {
    if (this.isPlaying()) return;

    this.isPlaying.set(true);
    this.playInterval = window.setInterval(() => {
      if (!this.canStepForward()) {
        this.pause();
        return;
      }
      this.stepForward();
    }, 1000);
  }

  pause(): void {
    this.isPlaying.set(false);
    if (this.playInterval !== null) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  }

  reset(): void {
    this.pause();
    this.executionService.reset();
  }

  togglePlayPause(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }
}
