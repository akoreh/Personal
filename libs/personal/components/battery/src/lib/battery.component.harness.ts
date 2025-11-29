import { ComponentHarness } from '@angular/cdk/testing';

export class BatteryHarness extends ComponentHarness {
  static hostSelector = 'ps-battery';

  private readonly getFillRect = this.locatorFor('rect');

  async getFillWidth(): Promise<number> {
    const rect = await this.getFillRect();
    const width = await rect.getAttribute('width');
    return width ? parseFloat(width) : 0;
  }

  async getFillColor(): Promise<string | null> {
    const rect = await this.getFillRect();
    const classes = await rect.getAttribute('class');
    return classes;
  }
}
