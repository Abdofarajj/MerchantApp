Project Structure — Reference for AI Assistant

Purpose: Defines the canonical folder structure, responsibilities, and guidelines for the merchant mobile app. This helps the AI assistant and team members understand where code and utilities are located.

Quick Overview
src/
├─ assets/
│ ├─ fonts/ (font files for the app)
│ └─ images/ (app icons, logos, splash screens, and other static assets)
├─ components/
│ ├─ ActivityCard.tsx (activity card component)
│ ├─ Avatar.tsx (user avatar component)
│ ├─ CustomTabBar.tsx (custom tab bar component)
│ ├─ DeviceCard.tsx (device card component)
│ ├─ Header.tsx (header component)
│ ├─ Icon.tsx (icon component)
│ ├─ POSCard.tsx (POS device card component)
│ ├─ POSDevicesSection.tsx (POS devices section component)
│ ├─ QuickActionButton.tsx (quick action button component)
│ ├─ Screen.tsx (base screen wrapper component)
│ ├─ Text.tsx (text component)
│ ├─ Toast.tsx (toast notification component)
│ ├─ UserCard.tsx (user card component)
│ ├─ BottomSheet/
│ │ ├─ index.ts (bottom sheet exports)
│ │ └─ RechargeBottomSheet.tsx (recharge bottom sheet component)
│ └─ Modal/
│ ├─ ConfirmationModal.tsx (confirmation modal component)
│ └─ index.ts (modal exports)
├─ config/
│ ├─ config.base.ts (base configuration with default values)
│ ├─ config.env.ts (environment variable handling)
│ └─ index.ts (main config export)
├─ contexts/
│ └─ AuthContext.tsx (authentication context provider)
├─ hooks/
│ ├─ use-color-scheme.ts (color scheme hook)
│ ├─ use-color-scheme.web.ts (web-specific color scheme hook)
│ ├─ use-theme-color.ts (theme color hook)
│ ├─ useAppData.ts (app data management hook)
│ ├─ useFetchData.ts (generic data fetching hook)
│ ├─ useHeader.ts (header management hook)
│ ├─ useHomeDetails.ts (home screen data hook with SignalR integration)
│ ├─ usePosDetails.ts (POS details hook)
│ └─ useSignalR.ts (SignalR connection management hook)
├─ navigation/
│ ├─ AppNavigator.tsx (main app navigation)
│ ├─ AuthNavigator.tsx (authentication navigation)
│ └─ RootNavigator.tsx (root navigation container)
├─ screens/
│ ├─ AccountScreen.tsx (user account screen)
│ ├─ ActivityScreen.tsx (activity/transactions screen)
│ ├─ CollectScreen.tsx (collection screen)
│ ├─ HomeScreen.tsx (main dashboard screen)
│ ├─ index.tsx (screen exports)
│ ├─ LoginScreen.tsx (login screen)
│ ├─ RechargeScreen.tsx (recharge screen)
│ └─ UsersScreen.tsx (users management screen)
├─ services/
│ ├─ api.ts (axios instance and base API setup)
│ ├─ errorHandler.ts (error handling utilities)
│ ├─ index.ts (service exports)
│ ├─ reactQuery.ts (React Query configuration)
│ ├─ schema.ts (shared API schemas)
│ ├─ Accounts/
│ │ ├─ hook.ts (accounts React hooks)
│ │ ├─ index.ts (accounts exports)
│ │ ├─ schema.ts (accounts TypeScript types)
│ │ └─ service.ts (accounts API functions)
│ ├─ auth/
│ │ ├─ hook.ts (auth React hooks)
│ │ ├─ index.ts (auth exports)
│ │ ├─ schema.ts (auth TypeScript types)
│ │ └─ service.ts (auth API functions)
│ ├─ ChargeOrders/
│ │ ├─ hook.ts (charge orders React hooks)
│ │ ├─ index.ts (charge orders exports)
│ │ ├─ schema.ts (charge orders TypeScript types)
│ │ └─ service.ts (charge orders API functions)
│ ├─ Dashboards/
│ │ ├─ hook.ts (dashboards React hooks)
│ │ ├─ index.ts (dashboards exports)
│ │ ├─ schema.ts (dashboards TypeScript types)
│ │ └─ service.ts (dashboards API functions)
│ ├─ DeviceMerchants/
│ │ ├─ hook.ts (device merchants React hooks)
│ │ ├─ index.ts (device merchants exports)
│ │ ├─ schema.ts (device merchants TypeScript types)
│ │ └─ service.ts (device merchants API functions)
│ ├─ Documents/
│ │ ├─ hook.ts (documents React hooks)
│ │ ├─ index.ts (documents exports)
│ │ ├─ schema.ts (documents TypeScript types)
│ │ └─ service.ts (documents API functions)
│ └─ SignalR/
│ ├─ index.ts (SignalR service exports)
│ └─ service.ts (SignalR connection management and real-time updates)
├─ store/
│ ├─ authStore.ts (authentication state management with Zustand)
│ └─ signalR.store.ts (SignalR state management with Zustand)
├─ theme/
│ └─ index.ts (design tokens and theme configuration)
└─ utils/
├─ apiProblem.ts (API problem utilities)
├─ logger.ts (logging utilities)
├─ storage.ts (persistent storage utilities)
└─ toast.ts (toast utilities)

Each top-level folder has a focused responsibility. Components use PascalCase; most other files use camelCase or kebab-case consistently.

How to Use this Structure

components/ – Reusable UI elements: basic, specialized, layout, interactive, and modal components.

config/ – App-wide configuration and environment-specific settings.

hooks/ – Reusable React hooks for UI logic, business logic, data fetching, and app lifecycle.

navigation/ – Navigation stacks, routing utilities, and typed route params.

screens/ – Individual screens for authentication, main flows, profiles, onboarding, support, and utilities.

services/ – API integration and data handling. Each service folder contains hook.ts (React hooks), service.ts (API functions), schema.ts (TypeScript types), and index.ts (exports). Main index.ts centralizes all service exports.

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
