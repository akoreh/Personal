import { byTestId } from '../helpers/selectors.helper';
import { KNOWN_APPS } from './desktop.page';

/**
 * Window Page Object
 * Represents an application window with controls and interactions
 */
export class WindowPage {
  private readonly selectors = {
    window: byTestId('window'),
    windowTitle: byTestId('windowTitle'),
    windowToolbar: byTestId('windowToolbar'),
    minimizeBtn: byTestId('windowMinimizeButton'),
    maximizeBtn: byTestId('windowMaximizeButton'),
    closeBtn: byTestId('windowCloseButton'),
  };

  constructor(private element: Cypress.Chainable) {}

  static getByTitle(title: string) {
    const selectors = {
      window: byTestId('window'),
      windowTitle: byTestId('windowTitle'),
    };

    return new WindowPage(
      cy
        .get(selectors.window)
        .contains(selectors.windowTitle, title)
        .closest(selectors.window),
    );
  }

  /**
   * Get window for the Resume app.
   * Use this instead of hardcoding the title in tests.
   */
  static getResumeWindow() {
    return WindowPage.getByTitle(KNOWN_APPS.RESUME.windowTitle);
  }

  static getFirst() {
    return new WindowPage(cy.get(byTestId('window')).first());
  }

  static getAll() {
    return cy.get(byTestId('window'));
  }

  shouldBeVisible() {
    this.element.should('be.visible');
    return this;
  }

  shouldHaveTitle(title: string) {
    this.element.find(this.selectors.windowTitle).should('contain', title);
    return this;
  }

  shouldBeMinimized() {
    this.element.should('have.class', 'hidden');
    return this;
  }

  shouldBeMaximized() {
    this.element.should('have.class', 'inset-0');
    return this;
  }

  shouldNotBeMinimized() {
    this.element.should('not.have.class', 'hidden');
    return this;
  }

  shouldNotBeMaximized() {
    this.element.should('not.have.class', 'inset-0');
    return this;
  }

  minimize() {
    this.element.find(this.selectors.minimizeBtn).click();
    return this;
  }

  maximize() {
    this.element.find(this.selectors.maximizeBtn).click();
    return this;
  }

  close() {
    this.element.find(this.selectors.closeBtn).click();
    return this;
  }

  drag(x: number, y: number) {
    this.element
      .find(this.selectors.windowToolbar)
      .trigger('mousedown', { button: 0 });
    cy.get(this.selectors.windowToolbar).trigger('mousemove', {
      clientX: x,
      clientY: y,
    });
    cy.get(this.selectors.windowToolbar).trigger('mouseup');
    return this;
  }

  focus() {
    this.element.click();
    return this;
  }
}
