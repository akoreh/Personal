import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TestingModule, byTestId } from '@po/shared/testing';

import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';

@Component({
  standalone: false,
  selector: 'ps-host',
  template: `<button [psTooltip]="tooltipText">Hover me</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  @Input() tooltipText = 'Test tooltip';
}

describe('TooltipDirective', () => {
  let spectator: Spectator<HostComponent>;

  const createComponent = createComponentFactory({
    component: HostComponent,
    imports: [TooltipDirective, TooltipComponent, OverlayModule, TestingModule],
  });

  const getButton = (): HTMLButtonElement =>
    spectator.query('button') as HTMLButtonElement;

  const getTooltip = (): Element => document.querySelector(byTestId('tooltip'));

  beforeEach(() => {
    spectator = createComponent();
  });

  test('should show tooltip on mouseenter', () => {
    spectator.dispatchMouseEvent(getButton(), 'mouseenter');

    const tooltip = getTooltip();
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent?.trim()).toBe('Test tooltip');
  });

  test('should hide tooltip on mouseleave', () => {
    spectator.dispatchMouseEvent(getButton(), 'mouseenter');

    expect(getTooltip()).toBeTruthy();

    spectator.dispatchMouseEvent(getButton(), 'mouseleave');
    expect(getTooltip()).toBeFalsy();
  });

  test('should show tooltip on focus', () => {
    spectator.dispatchFakeEvent(getButton(), 'focus');

    expect(getTooltip()).toBeTruthy();
  });

  test('should hide tooltip on blur', () => {
    spectator.dispatchFakeEvent(getButton(), 'focus');
    expect(getTooltip()).toBeTruthy();

    spectator.dispatchFakeEvent(getButton(), 'blur');
    expect(getTooltip()).toBeFalsy();
  });

  test('should update tooltip text when input changes', () => {
    spectator.setInput('tooltipText', 'New tooltip text');
    spectator.dispatchMouseEvent(getButton(), 'mouseenter');

    const tooltip = getTooltip();
    expect(tooltip?.textContent?.trim()).toBe('New tooltip text');
  });
});
