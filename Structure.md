Project Structure — Reference for AI Assistant

Purpose: Defines the canonical folder structure, responsibilities, and guidelines for the ride‑sharing mobile app. This helps the AI assistant and team members understand where code and utilities are located.

Quick Overview
src/
├─ components/
├─ config/
├─ hooks/
├─ navigators/
├─ screens/
├─ services/
├─ store/
├─ theme/
├─ utils/

Each top-level folder has a focused responsibility. Components use PascalCase; most other files use camelCase or kebab-case consistently.

How to Use this Structure

components/ – Reusable UI elements: basic, specialized, layout, interactive, and modal components.

config/ – App-wide configuration and environment-specific settings.

hooks/ – Reusable React hooks for UI logic, business logic, data fetching, and app lifecycle.

navigators/ – Navigation stacks, routing utilities, and typed route params.

screens/ – Individual screens for authentication, main flows, profiles, onboarding, support, and utilities.

services/ – API integration and data handling. Contains domain-specific hooks, service logic, schemas, and index files to centralize requests, responses, and type definitions.

store/ – Global state management and persistence using Zustand.

theme/ – Design tokens: colors, typography, spacing, radii, and helper utilities for consistent styling.

utils/ – Pure utility functions, formatters, helpers, and platform-specific utilities.

Coding Conventions & Guidelines

Use TypeScript across the codebase.

PascalCase for components, camelCase for variables/functions.

Prefer named exports for utilities; default exports for React components.

Always use theme tokens instead of hardcoding colors, spacing, or radii.

Add unit tests for pure functions and critical business hooks.

Guidelines for AI Assistant

Locate and reference code according to folder responsibility.

Avoid assuming specific file names; focus on the type of content each folder holds.

When generating code suggestions, follow existing folder conventions and maintain clean structure.

For UI work, always use theme tokens and reusable components.

For logic or API work, check hooks, services, and store for patterns before creating new code.

Quick Feature Bootstrap Checklist

Add API integration in services (hooks, service logic, schemas, index).

Add a new screen and integrate it with navigation.

Reuse or create components following design tokens.

Add or update state in the store if needed.
