import {
  ComponentHarness,
  HarnessQuery,
  LocatorFnResult,
  TestElement,
} from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { replaceAll } from '@po/shared/utilities';
import { last, words } from 'lodash-es';

export abstract class BaseHarness extends ComponentHarness {
  async getContent<T extends (HarnessQuery<any> | string)[]>(
    ...queries: T
  ): Promise<LocatorFnResult<T>> {
    return this.locatorFor(...queries)();
  }

  async getContents<T extends (HarnessQuery<any> | string)[]>(
    ...queries: T
  ): Promise<Array<LocatorFnResult<T>>> {
    return this.locatorForAll(...queries)();
  }

  async getOptionalContent<T extends (HarnessQuery<any> | string)[]>(
    ...queries: T
  ): Promise<LocatorFnResult<T> | null> {
    return this.locatorForOptional(...queries)();
  }

  protected async _getNumber(selector: string): Promise<number> {
    const text = await this._getText(selector);

    return parseInt(text, 10);
  }

  protected async _getOptionalNumber(
    selector: string,
  ): Promise<number | undefined> {
    const text = await this._getOptionalText(selector);

    if (text) {
      return parseInt(text, 10);
    }

    return undefined;
  }

  protected async _getAttribute(name: string): Promise<string | null> {
    return (await this.host()).getAttribute(name);
  }

  protected async _getId(): Promise<string | null> {
    const host = await this.host();

    return host.getAttribute('id');
  }

  protected async _click(
    selector: string,
    locatorType: 'optional' | 'required' = 'required',
  ): Promise<void> {
    if (locatorType === 'optional') {
      return (await this.locatorForOptional(selector)())?.click();
    }

    return (await this.locatorFor(selector)()).click();
  }

  protected async _getText(
    selector: string,
    options?: { normaliseWhitespace: boolean },
  ): Promise<string> {
    const locator = this.locatorFor(selector);

    const text = await (await locator()).text();

    if (options?.normaliseWhitespace) {
      return replaceAll(text, '  ', '');
    }

    return text;
  }

  protected async _getOptionalText(
    selector: string,
  ): Promise<string | undefined> {
    const locator = this.locatorForOptional(selector);

    return (await locator())?.text();
  }

  protected _getImageSrc(imageElm: TestElement): string {
    const nativeImg = TestbedHarnessEnvironment.getNativeElement(
      imageElm,
    ) as HTMLImageElement;

    return last(nativeImg.src.split('/')) as string;
  }
}
