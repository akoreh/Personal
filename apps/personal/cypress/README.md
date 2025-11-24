# Cypress E2E Tests

End-to-end tests for the Desktop OS application using Cypress.

## Running Tests

### Interactive Mode (with Cypress UI)

```bash
npx nx open-cypress personal
```

### Headless Mode

```bash
npx nx e2e personal
```

### CI Mode

```bash
npx nx e2e-ci personal
```

## Test Coverage

The e2e tests cover:

- **Desktop Manager**: Desktop visibility and icons
- **Query Params**: Opening apps via URL (`?apps=resume`)
- **Multiple Apps**: Opening multiple apps simultaneously
- **Desktop Icons**: Double-clicking to open apps
- **URL Synchronization**: URL updates when opening/closing apps
- **Window Controls**: Minimize, maximize, and close buttons
- **Window Interactions**: Dragging windows

## Test Structure

- `cypress/e2e/app.cy.ts` - Main test suite
- `cypress/support/app.po.ts` - Page Object Model with helper functions
- `cypress/support/commands.ts` - Custom Cypress commands
- `cypress/support/e2e.ts` - Global configuration and imports

## Page Object Model

Helper functions in `app.po.ts`:

- `getDesktopManager()` - Get desktop container
- `getWindows()` - Get all open windows
- `getDesktopIcons()` - Get all desktop icons
- `getWindowByTitle(title)` - Find window by title
- `openAppViaIcon(appName)` - Double-click icon to open app
- `closeWindow(window)` - Close a window
- `minimizeWindow(window)` - Minimize a window
- `maximizeWindow(window)` - Maximize a window
