---
applyTo: '**'
---

# Copilot Instructions for AI Coding Agents

You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Code Style

- Do NOT write comments for obvious code (e.g., `// Sanitize request body` above `req.body = sanitize(req.body)`)
- Only add comments for complex business logic, non-obvious algorithms, or important context that isn't clear from the code itself
- Prefer self-documenting code with clear variable and function names over explanatory comments

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead

## Styling

- **ALWAYS use Tailwind classes directly in templates** - this is the preferred method
- Only write SCSS files if absolutely necessary (e.g., complex animations, pseudo-elements that can't be handled with Tailwind)
- Keep all styling inline with Tailwind utility classes for better maintainability
- Use `ps-button` component for all buttons instead of native `<button>` elements
- Use `ps-input` component for all inputs instead of native `<input>` elements
- Button variants: `primary`, `secondary`, `success`, `danger`, etc.
- Example:
  ```html
  <ps-button variant="primary" (clicked)="doSomething()">Click Me</ps-button> <ps-input placeholder="Enter text" type="text" [(value)]="myValue" />
  ```

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Big Picture Architecture

- Nx-managed monorepo for a desktop-like web application.
- `apps/` contains main applications; `libs/` contains reusable libraries.
- Major features (window manager, dock, desktop manager, app shell) are libraries under `libs/personal/components/`.
- Shared utilities, models, and services are under `libs/shared/`.
- Each app/lib has its own `project.json` for Nx task configuration.

## Developer Workflows

- **Serve main app:** `npx nx serve personal`
- **Build for production:** `npx nx build personal`
- **Run unit tests:** `npx nx test <project-name>`
- **Explore Nx tasks:** `npx nx show project <project-name>`
- **Generate new apps/libs:**
  - `npx nx g @nx/angular:app demo`
  - `npx nx g @nx/angular:lib mylib`
- **Visualize project graph:** `npx nx graph`

## Project-Specific Conventions

- TypeScript path aliases in `tsconfig.base.json` follow the `@po/<category>/<name>` pattern:
  - `@po/personal/components/*` - Personal UI components
  - `@po/personal/state/*` - State management
  - `@po/personal/services/*` - Personal services
  - `@po/shared/*` - Shared utilities, models, services
  - `@po/backend/*` - Backend libraries
- **Important:** When generating libraries with Nx, always manually fix:
  1. The path alias in `tsconfig.base.json` to follow the `@po/<category>/<name>` convention (e.g., `@po/backend/core` instead of `@personal/core`)
  2. The `name` field in `project.json` to follow the `<category>-<name>` convention (e.g., `backend-core` instead of just `core`)
  3. **Add appropriate scope tags** to the `tags` array in `project.json`:
     - Backend projects: `["scope:backend", "type:feature"]` (or `type:app`, `type:util`, etc.)
     - Personal projects: `["scope:personal", "type:ui"]` (or `type:state`, `type:service`, etc.)
     - Shared projects: `["scope:shared"]`
  4. **Update the library's ESLint config** (`eslint.config.cjs`) to disable `@angular-eslint/prefer-standalone` for spec files. Add this block at the end of the config array:
     ```javascript
     {
       files: ['**/*.spec.ts'],
       rules: {
         '@angular-eslint/prefer-standalone': ['off'],
       },
     },
     ```
     This allows test `HostComponent` wrappers to use `standalone: false`.
- Each library/app has its own Jest config and test setup.
- UI components: `libs/personal/components/`
- State management: `libs/personal/state/`
- Models/services: `libs/personal/`, `libs/shared/`
- Backend libraries: `libs/backend/`
- Use path aliases for cross-feature communication; avoid direct imports across boundaries.

## Module Boundaries

- **Strict scope enforcement:** ESLint enforces module boundaries via `@nx/enforce-module-boundaries` rule
- **Backend scope** (`scope:backend`):
  - Can only import from `scope:backend` and `scope:shared`
  - Cannot import from `scope:personal`
- **Personal scope** (`scope:personal`):
  - Can only import from `scope:personal` and `scope:shared`
  - Cannot import from `scope:backend`
- **Shared scope** (`scope:shared`):
  - Can only import from other `scope:shared` libraries
  - Must remain framework-agnostic and reusable
- Violations are caught during `nx lint` and will fail CI builds

## Integration Points

- External dependencies: Nx, Angular, Jest, Tailwind, etc. (see `package.json`).
- Shared assets: `libs/assets/`
- API proxy config: `apps/personal/proxy.conf.json`

## Testing Enhancements

- Add `data-testid` attributes to any DOM element you will assert in tests (links, buttons, sections, dynamic text nodes).
- Prefer harnesses selecting elements via `byTestId` / `byTestIdIncludes` from `@po/shared/testing`.
- Avoid querying by aria-label or raw CSS unless necessary for accessibility-specific assertions.
- Keep harness APIs concise: expose semantic getters (e.g., `getPhoneText`) instead of leaking selectors.
- When adding new components, include test ids during initial implementation to prevent later refactors.

## Patterns & Examples

- **Add feature:** Generate library in `libs/personal/components/`, expose API via `src/index.ts`, update path aliases if needed.
- **Test feature:** `npx nx test <library-name>`; test setup in each library's `src/`.
- **Share code:** Use `libs/shared/` and import via path aliases.

## Key Files & Directories

- `tsconfig.base.json` – TypeScript config and path aliases
- `apps/personal/` – Main application
- `libs/personal/components/` – Feature components
- `libs/shared/` – Shared utilities, models, services
- `project.json` – Nx project configuration per app/lib
