import { DesktopPage, DockPage, KNOWN_DOCK_ITEMS } from '../support/page-objects';

describe('Dock', () => {
  const desktop = new DesktopPage();
  const dock = new DockPage();

  beforeEach(() => {
    desktop.visit();
  });

  context('Dock Links', () => {
    it('should display the dock', () => {
      dock.shouldBeVisible();
    });

    it('should have all expected dock links', () => {
      dock.shouldHaveLinkCount(3);
    });

    it('should have valid GitHub link', () => {
      dock.shouldHaveValidLink(
        KNOWN_DOCK_ITEMS.GITHUB.icon,
        KNOWN_DOCK_ITEMS.GITHUB.link,
      );
    });

    it('should have valid LinkedIn link', () => {
      dock.shouldHaveValidLink(
        KNOWN_DOCK_ITEMS.LINKEDIN.icon,
        KNOWN_DOCK_ITEMS.LINKEDIN.link,
      );
    });

    it('should have valid Email link', () => {
      dock.shouldHaveValidLink(
        KNOWN_DOCK_ITEMS.EMAIL.icon,
        KNOWN_DOCK_ITEMS.EMAIL.link,
      );
    });

    it('should open GitHub link in new tab', () => {
      dock
        .getLinkByIcon(KNOWN_DOCK_ITEMS.GITHUB.icon)
        .should('have.attr', 'target', '_blank');
    });
  });
});
