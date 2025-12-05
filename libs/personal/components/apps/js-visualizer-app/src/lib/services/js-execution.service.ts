import { Injectable, computed, signal } from '@angular/core';

import type {
  ExecutionState,
  ExecutionStep,
} from '../models/execution-step.model';

@Injectable({
  providedIn: 'root',
})
export class JsExecutionService {
  private readonly steps: ExecutionStep[] = [
    // Initial state
    {
      type: 'console',
      action: 'log',
      value: 'Starting execution...',
      description: 'Program starts',
    },
    // console.log(1) - synchronous
    {
      type: 'call-stack',
      action: 'push',
      value: 'console.log(1)',
      description: 'Push console.log(1) to call stack',
    },
    {
      type: 'console',
      action: 'log',
      value: '1',
      description: 'Execute console.log(1)',
    },
    {
      type: 'call-stack',
      action: 'pop',
      value: 'console.log(1)',
      description: 'Pop console.log(1) from call stack',
    },
    // setTimeout - macrotask
    {
      type: 'call-stack',
      action: 'push',
      value: 'setTimeout',
      description: 'Push setTimeout to call stack',
    },
    {
      type: 'macrotask',
      action: 'queue',
      value: "() => console.log('2')",
      description: 'Queue setTimeout callback to macrotask queue',
    },
    {
      type: 'call-stack',
      action: 'pop',
      value: 'setTimeout',
      description: 'Pop setTimeout from call stack',
    },
    // Promise - microtask
    {
      type: 'call-stack',
      action: 'push',
      value: 'Promise.resolve',
      description: 'Push Promise.resolve to call stack',
    },
    {
      type: 'microtask',
      action: 'queue',
      value: "() => console.log('3')",
      description: 'Queue promise callback to microtask queue',
    },
    {
      type: 'call-stack',
      action: 'pop',
      value: 'Promise.resolve',
      description: 'Pop Promise.resolve from call stack',
    },
    // Call stack empty - process microtask
    {
      type: 'microtask',
      action: 'dequeue',
      value: "() => console.log('3')",
      description: 'Call stack empty - dequeue microtask',
    },
    {
      type: 'call-stack',
      action: 'push',
      value: "console.log('3')",
      description: "Push console.log('3') to call stack",
    },
    {
      type: 'console',
      action: 'log',
      value: '3',
      description: "Execute console.log('3')",
    },
    {
      type: 'call-stack',
      action: 'pop',
      value: "console.log('3')",
      description: "Pop console.log('3') from call stack",
    },
    // Microtask queue empty - process macrotask
    {
      type: 'macrotask',
      action: 'dequeue',
      value: "() => console.log('2')",
      description: 'Microtask queue empty - dequeue macrotask',
    },
    {
      type: 'call-stack',
      action: 'push',
      value: "console.log('2')",
      description: "Push console.log('2') to call stack",
    },
    {
      type: 'console',
      action: 'log',
      value: '2',
      description: "Execute console.log('2')",
    },
    {
      type: 'call-stack',
      action: 'pop',
      value: "console.log('2')",
      description: "Pop console.log('2') from call stack",
    },
    {
      type: 'console',
      action: 'log',
      value: 'Execution complete!',
      description: 'All queues empty - execution complete',
    },
  ];

  private currentStepIndex = signal(0);
  private callStack = signal<string[]>([]);
  private microtaskQueue = signal<string[]>([]);
  private macrotaskQueue = signal<string[]>([]);
  private consoleOutput = signal<string[]>([]);

  readonly state = computed<ExecutionState>(() => ({
    callStack: this.callStack(),
    microtaskQueue: this.microtaskQueue(),
    macrotaskQueue: this.macrotaskQueue(),
    consoleOutput: this.consoleOutput(),
    currentStep: this.currentStepIndex(),
    isComplete: this.currentStepIndex() >= this.steps.length,
  }));

  readonly currentDescription = computed(() => {
    const index = this.currentStepIndex();
    return index < this.steps.length
      ? this.steps[index].description
      : 'Complete';
  });

  readonly canStepForward = computed(
    () => this.currentStepIndex() < this.steps.length,
  );
  readonly canStepBackward = computed(() => this.currentStepIndex() > 0);

  stepForward(): void {
    if (!this.canStepForward()) return;

    const step = this.steps[this.currentStepIndex()];
    this.applyStep(step);
    this.currentStepIndex.update((i) => i + 1);
  }

  stepBackward(): void {
    if (!this.canStepBackward()) return;

    this.currentStepIndex.update((i) => i - 1);
    const step = this.steps[this.currentStepIndex()];
    this.reverseStep(step);
  }

  reset(): void {
    this.currentStepIndex.set(0);
    this.callStack.set([]);
    this.microtaskQueue.set([]);
    this.macrotaskQueue.set([]);
    this.consoleOutput.set([]);
  }

  private applyStep(step: ExecutionStep): void {
    switch (step.type) {
      case 'call-stack':
        if (step.action === 'push') {
          this.callStack.update((stack) => [...stack, step.value]);
        } else if (step.action === 'pop') {
          this.callStack.update((stack) => stack.slice(0, -1));
        }
        break;
      case 'microtask':
        if (step.action === 'queue') {
          this.microtaskQueue.update((queue) => [...queue, step.value]);
        } else if (step.action === 'dequeue') {
          this.microtaskQueue.update((queue) => queue.slice(1));
        }
        break;
      case 'macrotask':
        if (step.action === 'queue') {
          this.macrotaskQueue.update((queue) => [...queue, step.value]);
        } else if (step.action === 'dequeue') {
          this.macrotaskQueue.update((queue) => queue.slice(1));
        }
        break;
      case 'console':
        if (step.action === 'log') {
          this.consoleOutput.update((output) => [...output, step.value]);
        }
        break;
    }
  }

  private reverseStep(step: ExecutionStep): void {
    switch (step.type) {
      case 'call-stack':
        if (step.action === 'push') {
          this.callStack.update((stack) => stack.slice(0, -1));
        } else if (step.action === 'pop') {
          this.callStack.update((stack) => [...stack, step.value]);
        }
        break;
      case 'microtask':
        if (step.action === 'queue') {
          this.microtaskQueue.update((queue) => queue.slice(0, -1));
        } else if (step.action === 'dequeue') {
          this.microtaskQueue.update((queue) => [step.value, ...queue]);
        }
        break;
      case 'macrotask':
        if (step.action === 'queue') {
          this.macrotaskQueue.update((queue) => queue.slice(0, -1));
        } else if (step.action === 'dequeue') {
          this.macrotaskQueue.update((queue) => [step.value, ...queue]);
        }
        break;
      case 'console':
        if (step.action === 'log') {
          this.consoleOutput.update((output) => output.slice(0, -1));
        }
        break;
    }
  }
}
