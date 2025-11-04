# @struc.md

Rules for the AI assistant regarding project structure, folder responsibilities, and coding conventions for the ride‑sharing mobile app.

## Guidelines

The AI should reference folder responsibilities, not specific file names.

components/ – Reusable UI elements including basic, specialized, layout, interactive, and modal components.

config/ – App-wide configuration and environment-specific settings.

hooks/ – Reusable React hooks for UI logic, business logic, data fetching, and app lifecycle.

navigators/ – Navigation stacks, routing utilities, and typed route parameters.

screens/ – Screen-level components for authentication, main flows, profiles, onboarding, support, and utilities.

services/ – API integration and data handling. Should include domain-specific hooks, service logic, schemas, and index files.

store/ – Global state management and persistence using Zustand.

theme/ – Design tokens for colors, typography, spacing, radii, and theming helpers.

utils/ – Pure utility functions, formatters, helpers, and platform-specific utilities.

Follow TypeScript conventions: PascalCase for components; camelCase for functions and variables.

Prefer named exports for utilities; default exports for React components.

Always use theme tokens instead of hardcoding values for styling.

Add unit tests for pure functions and critical business hooks.

Maintain existing folder patterns when generating code or adding new logic.

For UI work, always reuse components and theme tokens.

For logic or API work, check hooks, services, and store for patterns before creating new code.

When adding features:

Integrate API logic in services (hooks, service logic, schemas, index).

Add new screens and update navigators.

Reuse or create components with theme tokens.

Add or update state in the store if needed.
