export interface ExecutionStep {
  type: 'call-stack' | 'microtask' | 'macrotask' | 'console';
  action: 'push' | 'pop' | 'queue' | 'dequeue' | 'log';
  value: string;
  description: string;
}

export interface ExecutionState {
  callStack: string[];
  microtaskQueue: string[];
  macrotaskQueue: string[];
  consoleOutput: string[];
  currentStep: number;
  isComplete: boolean;
}
