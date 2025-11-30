import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { AuthAppComponent } from './auth-app.component';

describe('AuthAppComponent', () => {
  let spectator: Spectator<AuthAppComponent>;

  const createComponent = createComponentFactory({
    component: AuthAppComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  test('should boot', () => {
    expect(spectator.component).toBeTruthy();
  });
});
