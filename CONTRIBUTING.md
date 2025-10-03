# Contributing to Job Tracker

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Set up your `.env` file (see SETUP.md)
4. Run database migrations: `pnpm db:push`
5. Start development servers: `pnpm dev`

## Project Structure

```
job-tracker/
├── apps/
│   ├── api/          # Express API server
│   └── web/          # Next.js web app
├── packages/
│   ├── db/           # Prisma schema and client
│   ├── parsers/      # Email parsing logic
│   └── shared/       # Shared types and utilities
└── tests/
    └── e2e/          # End-to-end tests
```

## Code Style

- TypeScript for all code
- Use ESLint and Prettier (run `pnpm lint` and `pnpm format`)
- Follow existing patterns and conventions
- Write meaningful variable and function names
- Add comments for complex logic

## Making Changes

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Write/update tests as needed
4. Run tests: `pnpm test`
5. Run linting: `pnpm lint`
6. Commit with clear messages
7. Push and create a pull request

## Commit Messages

Follow conventional commits format:

- `feat: add new parser for LinkedIn`
- `fix: correct dedupe key generation`
- `docs: update setup instructions`
- `test: add tests for fallback parser`
- `refactor: simplify application service`

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm --filter @job-tracker/parsers test
```

### E2E Tests

```bash
pnpm test:e2e
```

### API Tests

```bash
pnpm test:api
```

## Adding New Email Parsers

1. Create parser in `packages/parsers/src/[vendor].ts`
2. Export from `packages/parsers/src/index.ts`
3. Add test fixture in `packages/parsers/fixtures/`
4. Add tests in `packages/parsers/src/index.test.ts`
5. Update README with supported vendor

Example parser structure:

```typescript
import { ParsedApplication } from '@job-tracker/shared';

export function parseVendor(
  emailContent: string,
  sender: string
): ParsedApplication | null {
  // Detection logic
  if (!isVendorEmail(emailContent, sender)) {
    return null;
  }

  // Parsing logic
  const title = extractTitle(emailContent);
  const company = extractCompany(emailContent);

  if (!title || !company) {
    return null;
  }

  return {
    title,
    company,
    vendor: 'vendorname',
    confidence: 0.9,
  };
}
```

## Adding New API Endpoints

1. Create route in `apps/api/src/routes/`
2. Add service logic in `apps/api/src/services/`
3. Add validation schema in `packages/shared/src/validators.ts`
4. Add tests in `apps/api/src/routes/*.test.ts`
5. Update README with API documentation

## Adding New UI Pages

1. Create page in `apps/web/src/app/`
2. Create components in `apps/web/src/components/`
3. Use TailwindCSS for styling
4. Ensure mobile responsiveness
5. Add to navigation if needed

## Database Changes

1. Update `packages/db/prisma/schema.prisma`
2. Run `pnpm db:push` to apply changes
3. Update TypeScript types if needed
4. Create migration: `pnpm db:migrate`
5. Update seed data if needed

## Documentation

- Update README.md for user-facing changes
- Update SETUP.md for setup changes
- Add JSDoc comments for public APIs
- Update DEPLOYMENT.md for deployment changes

## Pull Request Process

1. Update documentation as needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG if applicable
5. Request review from maintainers

## Questions or Issues?

- Check existing issues first
- Create a new issue with clear description
- Provide reproduction steps for bugs
- Include relevant logs and screenshots

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what is best for the community

Thank you for contributing! 🎉

