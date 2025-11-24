/**
 * URL Navigation and Assertion Helpers
 * Provides utilities for URL-based operations in tests
 */

export const UrlHelper = {
  visitHome: () => cy.visit('/'),

  visitWithApps: (appIds: string[]) => cy.visit(`/?apps=${appIds.join(',')}`),

  shouldHaveAppsParam: (appIds: string[]) => {
    cy.url().should('include', `apps=${appIds.join(',')}`);
  },

  shouldNotHaveAppsParam: () => {
    cy.url().should('not.include', 'apps=');
  },
};
