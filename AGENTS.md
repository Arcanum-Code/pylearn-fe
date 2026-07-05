# Pylearn

An interactive platform to learn Python featuring quizzes, learning materials, role-based access control, and multi-language support.

## Commands
- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server at localhost:3000
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Gotchas
- **IMPORTANT**: Always forward the `Authorization` and `accept-language` headers in Next.js API routes when proxying requests to the backend.
- **IMPORTANT**: Use `pnpm` for all package management, never use `npm` or `yarn`.

## Conventions
- **Feature Architecture**: Code is strictly modularized in `features/[feature-name]/`. Each feature encapsulates its own components, config, hooks, services, and types. Export public members via `index.ts`.
- **Internationalization (i18n)**:
  - Add keys to `features/{feature}/config/locales/{en,es,id}.json`.
  - Register new features in `app/providers/I18nProvider.tsx`.
  - Use the `useTranslations` hook from `@/lib/i18n/useTranslation`.
- **API & Data Fetching**:
  - Define backend URLs centrally in `app/api/api.ts`.
  - Implement API calls in `features/{feature}/services/` and return both data and localized messages.
  - Use custom hooks in `features/{feature}/hooks/` following the `keyFactory` pattern for query keys.
- **UI & Forms**: Use `shadcn/ui` components. Use `react-hook-form` + `zod` for schemas (defined in `features/{feature}/schemas/`). Fetch data by ID when dialogs open and show skeletons during loading.
- **RBAC**: Wrap protected components with `PermissionsProvider` checks using feature-based permission strings managed in the `rbac` feature.
