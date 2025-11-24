import { byTestId } from '../helpers/selectors.helper';
import { UrlHelper } from '../helpers/url.helper';

/**
 * Known apps in the registry.
 * Update these constants if app names or icons change.
 */
export const KNOWN_APPS = {
  RESUME: {
    id: 'resume',
    windowTitle: 'Resume',
    iconName: 'Resume.peedeef',
  },
} as const;

/**
 * Desktop Page Object
 * Represents the main desktop environment with icons and windows
 */
export class DesktopPage {
  private readonly selectors = {
    desktopManager: byTestId('desktopManager'),
    window: byTestId('window'),
    windowTitle: byTestId('windowTitle'),
  };

  visit() {
    UrlHelper.visitHome();
    return this;
  }

  visitWithApps(appIds: string[]) {
    UrlHelper.visitWithApps(appIds);
    return this;
  }

  shouldBeVisible() {
    cy.get(this.selectors.desktopManager).should('be.visible');
    return this;
  }

  getAllWindows() {
    return cy.get(this.selectors.window);
  }

  getWindowByTitle(title: string) {
    return cy
      .get(this.selectors.window)
      .contains(this.selectors.windowTitle, title)
      .closest(this.selectors.window);
  }

  shouldHaveNoWindows() {
    cy.get(this.selectors.window).should('not.exist');
    return this;
  }

  shouldHaveWindowCount(count: number) {
    cy.get(this.selectors.window).should('have.length', count);
    return this;
  }

  shouldHaveAtLeastWindowCount(count: number) {
    cy.get(this.selectors.window).should('have.length.at.least', count);
    return this;
  }
}
