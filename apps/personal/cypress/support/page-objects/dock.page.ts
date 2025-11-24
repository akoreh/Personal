import { byTestId } from '../helpers/selectors.helper';

/**
 * Known dock items with their expected links.
 * Update these if dock items change.
 */
export const KNOWN_DOCK_ITEMS = {
  GITHUB: {
    icon: 'github',
    link: 'https://github.com/akoreh/Personal/tree/main',
  },
  LINKEDIN: {
    icon: 'linkedin',
    link: 'https://www.linkedin.com/in/andrei-koreh-71084b169/',
  },
  EMAIL: {
    icon: 'envelope',
    link: 'mailto:korehdev@gmail.com',
  },
} as const;

/**
 * Dock Page Object
 * Represents the dock with external links and minimized windows
 */
export class DockPage {
  private readonly selectors = {
    dock: byTestId('dock'),
    dockLink: byTestId('dockLink'),
  };

  shouldBeVisible() {
    cy.get(this.selectors.dock).should('be.visible');
    return this;
  }

  getDockLinks() {
    return cy.get(this.selectors.dockLink);
  }

  shouldHaveLinkCount(count: number) {
    this.getDockLinks().should('have.length', count);
    return this;
  }

  getLinkByIcon(icon: string) {
    return cy.get(this.selectors.dockLink).filter(`[data-icon="${icon}"]`);
  }

  shouldHaveValidLink(icon: string, expectedHref: string) {
    this.getLinkByIcon(icon)
      .should('exist')
      .should('have.attr', 'href', expectedHref)
      .should('have.attr', 'target', '_blank');
    return this;
  }

  clickLink(icon: string) {
    this.getLinkByIcon(icon).click();
    return this;
  }
}
