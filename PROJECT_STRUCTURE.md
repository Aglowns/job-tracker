# Project Structure

This document provides an overview of the Job Tracker codebase organization.

```
job-tracker/
├── apps/
│   ├── api/                              # Express API Server
│   │   ├── src/
│   │   │   ├── connectors/               # Email service connectors
│   │   │   │   ├── gmail.connector.ts    # Gmail API integration
│   │   │   │   └── outlook.connector.ts  # Microsoft Graph integration
│   │   │   ├── routes/                   # API route handlers
│   │   │   │   ├── applications.routes.ts
│   │   │   │   ├── capture.routes.ts
│   │   │   │   ├── followups.routes.ts
│   │   │   │   └── webhooks.routes.ts
│   │   │   ├── services/                 # Business logic
│   │   │   │   ├── application.service.ts
│   │   │   │   ├── audit.service.ts
│   │   │   │   └── followup.service.ts
│   │   │   ├── config.ts                 # Environment configuration
│   │   │   └── index.ts                  # Server entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts
│   │
│   └── web/                              # Next.js Web Application
│       ├── public/                       # Static assets
│       │   ├── manifest.json             # PWA manifest
│       │   ├── sw.js                     # Service worker
│       │   ├── register-sw.js            # SW registration
│       │   ├── icon-192.png              # PWA icon (placeholder)
│       │   └── icon-512.png              # PWA icon (placeholder)
│       ├── src/
│       │   ├── app/                      # Next.js 14 App Router
│       │   │   ├── applications/
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx      # Application detail page
│       │   │   ├── bookmarklet/
│       │   │   │   └── page.tsx          # Bookmarklet setup page
│       │   │   ├── capture/
│       │   │   │   ├── page.tsx          # Manual capture form
│       │   │   │   └── shared/
│       │   │   │       └── route.ts      # Web Share Target handler
│       │   │   ├── globals.css           # Global styles
│       │   │   ├── layout.tsx            # Root layout
│       │   │   └── page.tsx              # Home page (list)
│       │   └── components/               # React components
│       │       ├── ApplicationDetail.tsx
│       │       └── ApplicationList.tsx
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.js
│       ├── tailwind.config.js
│       └── tsconfig.json
│
├── packages/
│   ├── db/                               # Database Package
│   │   ├── prisma/
│   │   │   ├── schema.prisma             # Prisma schema definition
│   │   │   └── seed.ts                   # Database seeding script
│   │   ├── src/
│   │   │   └── index.ts                  # Prisma client export
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── parsers/                          # Email Parsers Package
│   │   ├── fixtures/                     # Test email samples
│   │   │   ├── greenhouse-sample.json
│   │   │   ├── lever-sample.json
│   │   │   ├── workday-sample.json
│   │   │   └── generic-sample.json
│   │   ├── src/
│   │   │   ├── greenhouse.ts             # Greenhouse parser
│   │   │   ├── lever.ts                  # Lever parser
│   │   │   ├── workday.ts                # Workday parser
│   │   │   ├── fallback.ts               # Generic fallback parser
│   │   │   ├── index.ts                  # Main parser interface
│   │   │   └── index.test.ts             # Parser tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts
│   │
│   └── shared/                           # Shared Types & Utilities
│       ├── src/
│       │   ├── types.ts                  # TypeScript interfaces
│       │   ├── validators.ts             # Zod schemas
│       │   ├── utils.ts                  # Utility functions
│       │   └── index.ts                  # Package exports
│       ├── package.json
│       └── tsconfig.json
│
├── tests/
│   └── e2e/                              # End-to-end tests
│       └── basic.spec.ts                 # Basic E2E tests
│
├── .eslintrc.json                        # ESLint configuration
├── .gitignore                            # Git ignore rules
├── .prettierrc                           # Prettier configuration
├── CHANGELOG.md                          # Version history
├── CONTRIBUTING.md                       # Contribution guidelines
├── DEPLOYMENT.md                         # Deployment guide
├── LICENSE                               # MIT License
├── package.json                          # Root package.json
├── playwright.config.ts                  # Playwright configuration
├── pnpm-workspace.yaml                   # pnpm workspace config
├── PROJECT_STRUCTURE.md                  # This file
├── QUICKSTART.md                         # Quick start guide
├── README.md                             # Main documentation
├── SETUP.md                              # Detailed setup guide
├── tsconfig.json                         # Root TypeScript config
└── env.example                           # Environment variables template
```

## Key Directories

### `/apps`
Contains the deployable applications:
- **api**: Express REST API server
- **web**: Next.js frontend application

### `/packages`
Contains shared code packages:
- **db**: Database schema and Prisma client
- **parsers**: Email parsing logic for various ATS systems
- **shared**: Common types, validators, and utilities

### `/tests`
Contains end-to-end tests using Playwright

## Package Dependencies

```
apps/api depends on:
  - @job-tracker/db
  - @job-tracker/parsers
  - @job-tracker/shared

apps/web depends on:
  - @job-tracker/shared

packages/parsers depends on:
  - @job-tracker/shared

packages/db:
  - Independent (only Prisma)

packages/shared:
  - Independent (base package)
```

## Technology Stack

### Backend (apps/api)
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Validation**: Zod
- **Scheduling**: node-cron
- **Email**: googleapis, @microsoft/microsoft-graph-client

### Frontend (apps/web)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React Server Components
- **Styling**: TailwindCSS
- **Date**: date-fns
- **PWA**: Custom service worker

### Database (packages/db)
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5

### Parsers (packages/parsers)
- **Language**: TypeScript
- **Testing**: Vitest

### Testing
- **Unit**: Vitest
- **API**: Supertest
- **E2E**: Playwright

## Build Output

After running `pnpm build`:

```
apps/api/dist/               # Compiled JavaScript
apps/web/.next/              # Next.js build output
packages/*/dist/             # Compiled packages
packages/db/node_modules/.prisma/  # Generated Prisma client
```

## Development vs Production

### Development
- TypeScript files executed with `tsx` (API) or Next.js dev server (Web)
- Hot reload enabled
- Source maps available
- Verbose logging

### Production
- Compiled to JavaScript
- Optimized builds
- Minimal logging
- Environment-specific configurations

## Configuration Files

- **tsconfig.json**: Root TypeScript configuration (extended by packages)
- **pnpm-workspace.yaml**: Defines monorepo workspace structure
- **playwright.config.ts**: E2E test configuration
- **.eslintrc.json**: Linting rules
- **.prettierrc**: Code formatting rules
- **env.example**: Environment variable template

## Environment Variables

See `env.example` for all required and optional environment variables.

## Monorepo Management

This project uses **pnpm workspaces** for monorepo management:

- Shared dependencies are hoisted to root
- Each package has its own `package.json`
- Cross-package dependencies use `workspace:*` protocol
- Commands can be run for all packages or filtered

## Scripts

Available at root level:
- `pnpm dev` - Start all dev servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm db:push` - Apply database changes
- `pnpm seed` - Seed database

## Code Organization Principles

1. **Separation of Concerns**: API, Web, and shared code are separate
2. **Type Safety**: TypeScript throughout
3. **Validation**: Zod schemas for runtime validation
4. **Testing**: Tests alongside implementation
5. **Documentation**: Inline JSDoc + external docs

## Adding New Features

### New API Endpoint
1. Add route in `apps/api/src/routes/`
2. Add service in `apps/api/src/services/`
3. Add validator in `packages/shared/src/validators.ts`
4. Add tests

### New Web Page
1. Add page in `apps/web/src/app/`
2. Create components in `apps/web/src/components/`
3. Add to navigation

### New Parser
1. Add parser in `packages/parsers/src/`
2. Add fixture in `packages/parsers/fixtures/`
3. Add tests
4. Export from index

## Further Reading

- [README.md](./README.md) - Overview and API docs
- [SETUP.md](./SETUP.md) - Detailed setup
- [QUICKSTART.md](./QUICKSTART.md) - Fast setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
- [CHANGELOG.md](./CHANGELOG.md) - Version history

