import { byTestId } from '../helpers/selectors.helper';
import { KNOWN_APPS } from './desktop.page';

/**
 * Desktop Icon Page Object
 * Represents an individual desktop icon that can be interacted with
 */
export class DesktopIconPage {
  private readonly selector = byTestId('desktopIcon');

  constructor(private appName: string) {}

  /**
   * Get the Resume app icon.
   * Use this instead of hardcoding the icon name in tests.
   */
  static getResumeIcon() {
    return new DesktopIconPage(KNOWN_APPS.RESUME.iconName);
  }

  private getElement() {
    return cy.get(this.selector).contains(this.appName).closest(this.selector);
  }

  shouldExist() {
    this.getElement().should('exist');
    return this;
  }

  shouldBeVisible() {
    this.getElement().should('be.visible');
    return this;
  }

  click() {
    this.getElement().click();
    return this;
  }

  doubleClick() {
    this.getElement().dblclick();
    return this;
  }

  shouldBeFocused() {
    this.getElement().should('have.class', 'font-bold');
    return this;
  }
}
