/* eslint-disable @angular-eslint/prefer-standalone */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { EducationComponent } from './resume-education.component';
import { EducationHarness } from './resume-education.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-resume-education />`,
})
class HostComponent {}

describe('EducationComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: EducationHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [EducationComponent],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(EducationHarness);
  });

  test('should display the correct school name', async () => {
    expect(await harness.getSchool()).toBe(
      'Technical University of Cluj-Napoca',
    );
  });

  test('should display the correct degree', async () => {
    expect(await harness.getDegree()).toBe('B.Sc. in Computer Science');
  });

  test('should display the correct dates', async () => {
    expect(await harness.getDates()).toBe('Oct. 2015 – Jun. 2018');
  });
});
