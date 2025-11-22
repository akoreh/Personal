/* eslint-disable @angular-eslint/prefer-standalone */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { ContactInfoComponent } from './resume-contact-info.component';
import { ContactInfoHarness } from './resume-contact-info.harness';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<ps-resume-contact-info />`,
})
class HostComponent {}

describe('ContactInfoComponent', () => {
  let spectator: Spectator<HostComponent>;
  let harness: ContactInfoHarness;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [ContactInfoComponent],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    harness = await loader.getHarness(ContactInfoHarness);
  });

  test('should display and use the correct email', async () => {
    expect(await harness.getEmail()).toBe('📧 korehdev@gmail.com');
    expect(await harness.getEmailHref()).toBe('mailto:korehdev@gmail.com');
  });

  test('should display and use the correct LinkedIn', async () => {
    expect(await harness.getLinkedIn()).toBe('🔗 linkedin.com/in/andrei-koreh');
    expect(await harness.getLinkedInHref()).toBe(
      'https://www.linkedin.com/in/andrei-koreh-71084b169/',
    );
  });

  test('should display the correct location text', async () => {
    expect(await harness.getLocation()).toBe('📍 Cluj-Napoca, Romania');
  });
});
