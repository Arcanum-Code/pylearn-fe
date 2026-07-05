# Pylearn

An interactive platform to learn Python featuring quizzes, learning materials, role-based access control, and multi-language support.

## Features

- **Interactive Quizzes:** test your Python knowledge with structured quiz flows.
- **Learning Materials:** access and study comprehensive Python content.
- **Role-Based Access Control:** distinct experiences for students and administrators.
- **User Management:** manage users, roles, and permissions securely.
- **Multi-Language Support:** translate the UI seamlessly across English, Spanish, and Indonesian.
- **Responsive Design:** modern, mobile-friendly UI using Tailwind CSS and shadcn/ui.
- **React Query:** manage server state and caching efficiently.
- **Type-safe Forms:** validate user input easily with React Hook Form and Zod.

## Getting Started

```bash
git clone https://github.com/Arcanum-Code/pylearn-fe.git
cd pylearn-fe
pnpm install
cp .env .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Requirements

- Node.js 18+
- pnpm

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Public backend API connection string | Yes |
| `API_URL` | Internal backend API connection string | Yes |

## Tech Stack

- [Next.js](https://nextjs.org/) — framework
- [TypeScript](https://www.typescriptlang.org/) — language
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [React Query](https://tanstack.com/query) — data fetching
- [shadcn/ui](https://ui.shadcn.com/) — UI components

## License

MIT
