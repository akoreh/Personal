import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, Input } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { ISODateString } from '@po/shared/models';
import { create } from 'lodash-es';

import { TerminalAppStatusBarComponent } from './terminal-app-status-bar.component';
import { TerminalAppStatusBarHarness } from './testing/terminal-app-status-bar.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-terminal-app-status-bar [path]="path" [date]="date" />`,
})
class HostComponent {
  @Input() path = '~/Desktop/testing';
  @Input() date: ISODateString = new Date(
    Date.UTC(2003, 9, 23, 13, 43, 33),
  ).toISOString();
}

describe('TerminalAppStatusBarComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: TerminalAppStatusBarHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [TerminalAppStatusBarComponent],
  });

  beforeEach(async () => {
    spectator = createComponent();

    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(TerminalAppStatusBarHarness);
  });

  test('should display the passed in path', async () => {
    expect(await harness.getPath()).toBe('~/Desktop/testing');
    spectator.setInput('path', 'some other path');
    expect(await harness.getPath()).toBe('some other path');
  });

  test('should display the hours minutes and seconds of the passed in date', async () => {
    expect(await harness.getDate()).toBe('at 16:43:33');
  });
});
