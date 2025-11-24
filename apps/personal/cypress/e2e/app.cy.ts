import { UrlHelper } from '../support/helpers/url.helper';
import {
  DesktopIconPage,
  DesktopPage,
  KNOWN_APPS,
  WindowPage,
} from '../support/page-objects';

describe('Desktop OS App', () => {
  const desktop = new DesktopPage();

  context('Desktop Environment', () => {
    beforeEach(() => {
      desktop.visit();
    });

    it('should display the desktop manager', () => {
      desktop.shouldBeVisible();
    });

    it('should display desktop icons', () => {
      DesktopIconPage.getResumeIcon().shouldExist();
    });
  });

  context('Opening Apps via Query Parameters', () => {
    it('should open Resume app when ?apps=resume is in URL', () => {
      desktop.visitWithApps([KNOWN_APPS.RESUME.id]);

      WindowPage.getResumeWindow()
        .shouldBeVisible()
        .shouldHaveTitle(KNOWN_APPS.RESUME.windowTitle);
    });

    it('should open multiple apps when ?apps=resume,terminal is in URL', () => {
      desktop.visitWithApps([KNOWN_APPS.RESUME.id, 'terminal']);

      desktop.shouldHaveAtLeastWindowCount(1);
    });

    it('should not open any apps when no query param is present', () => {
      desktop.visit();

      desktop.shouldHaveNoWindows();
    });
  });

  context('Opening Apps via Desktop Icons', () => {
    beforeEach(() => {
      desktop.visit();
    });

    it('should open Resume app when double-clicking its icon', () => {
      DesktopIconPage.getResumeIcon().doubleClick();

      WindowPage.getResumeWindow()
        .shouldBeVisible()
        .shouldHaveTitle(KNOWN_APPS.RESUME.windowTitle);
    });

    it('should update URL with ?apps=resume when opening via icon', () => {
      DesktopIconPage.getResumeIcon().doubleClick();

      UrlHelper.shouldHaveAppsParam([KNOWN_APPS.RESUME.id]);
    });
  });

  context('Closing Apps', () => {
    it('should remove app from URL when closing window', () => {
      desktop.visitWithApps([KNOWN_APPS.RESUME.id]);

      WindowPage.getResumeWindow().shouldBeVisible().close();

      UrlHelper.shouldNotHaveAppsParam();
    });
  });

  context.skip('Window Interactions', () => {
    beforeEach(() => {
      desktop.visitWithApps([KNOWN_APPS.RESUME.id]);
      WindowPage.getResumeWindow().shouldBeVisible();
    });

    it('should minimize window', () => {
      WindowPage.getResumeWindow().minimize().shouldBeMinimized();
    });

    it('should maximize window', () => {
      WindowPage.getResumeWindow().maximize().shouldBeMaximized();
    });

    it('should restore minimized window', () => {
      const window = WindowPage.getResumeWindow();

      window.minimize().shouldBeMinimized();
      window.minimize().shouldNotBeMinimized();
    });

    it('should restore maximized window', () => {
      const window = WindowPage.getResumeWindow();

      window.maximize().shouldBeMaximized();
      window.maximize().shouldNotBeMaximized();
    });

    it('should drag window to new position', () => {
      WindowPage.getResumeWindow().drag(300, 300).shouldBeVisible();
    });
  });
});
