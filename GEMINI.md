# Gemini Project Context: Next Auth Starter

This project is a production-ready Next.js 16 starter template with authentication, role-based access control (RBAC), and multi-language support. It uses a feature-based architecture to maintain modularity and scalability.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **i18n**: Custom feature-based implementation
- **HTTP Client**: Axios (proxied through Next.js API routes)
- **Package Manager**: pnpm

## Project Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/            # Authentication routes (login)
│   ├── (main)/            # Protected routes (dashboard, management, etc.)
│   ├── api/               # Next.js API routes (proxies to backend)
│   │   └── api.ts         # Centralized backend endpoint definitions
│   └── providers/         # Client-side context providers
├── components/            # Shared UI components (mostly shadcn/ui)
├── features/              # Modular feature-based organization
│   ├── auth/              # Authentication logic
│   ├── dashboard/         # Dashboard statistics and widgets
│   ├── layout/            # Shell components (Navbar, Sidebar)
│   ├── materials/         # Content management
│   ├── quizzes/           # Quiz management
│   ├── rbac/              # Role-Based Access Control (roles, permissions)
│   └── user/              # User management
├── hooks/                # Shared React hooks
├── lib/                  # Utilities and core logic
│   └── i18n/             # i18n implementation details
├── messages/            # Global/common translation files
└── public/               # Static assets
```

## Feature Architecture

Each feature in `features/` follows a consistent internal structure:

```
features/[feature-name]/
├── components/          # React components specific to this feature
├── config/             # Configuration (translation keys, constants)
│   └── locales/        # Feature-specific translation JSON files
├── context/            # Optional feature-specific providers
├── hooks/              # Feature-specific React Query hooks
├── services/           # API call functions (using Axios)
├── types/              # TypeScript interfaces and types
└── index.ts           # Public API for the feature
```

## Development Guidelines

### 1. Internationalization (i18n)

Translations are modularized by feature.

- **Adding Translations**: Add keys to `features/{feature}/config/locales/{en,es,id}.json`.
- **Registering Feature**: Import and add new feature translations to `app/providers/I18nProvider.tsx`.
- **Usage**: Use the `useTranslations` hook from `@/lib/i18n/useTranslation`.
- **Backend Sync**: The `accept-language` header is automatically added to Axios requests via `app/utils/axios.ts` and should be forwarded in Next.js API routes.

### 2. API & Data Fetching

- **Endpoint Definition**: Define backend URLs in `app/api/api.ts`.
- **API Routes**: Create Next.js API routes in `app/api/` to proxy requests. Always forward the `Authorization` and `accept-language` headers.
- **Services**: Implement API calls in `features/{feature}/services/`. Return both data and localized messages for toast notifications.
- **React Query**: Use custom hooks in `features/{feature}/hooks/` for fetching. Follow the `keyFactory` pattern for query keys.

### 3. UI & Components

- **Components**: Use shadcn/ui components from `components/ui/`.
- **Dialogs**: Follow the pattern of fetching data by ID when a dialog opens, showing skeletons during the loading state.
- **Forms**: Use `react-hook-form` with `zod` schemas defined in `features/{feature}/schemas/`.

### 4. RBAC (Permissions)

- Wrap protected components or logic with `PermissionsProvider` checks.
- Use feature-based permission strings managed in the `rbac` feature.

## Building and Running

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start development server at [http://localhost:3000](http://localhost:3000) |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Common Tasks

### Adding a New Feature
1. Create directory in `features/`.
2. Implement components, hooks, and services following the standard structure.
3. Add locale files in `config/locales/`.
4. Merge feature locales into `app/providers/I18nProvider.tsx`.
5. Export public members via `index.ts`.

### Adding a New API Endpoint
1. Add URL to `app/api/api.ts`.
2. Create proxy route in `app/api/`.
3. Create service function in the relevant feature's `services/`.
4. Create React Query hook in `hooks/`.
