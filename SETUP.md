# Setup Guide

This guide will help you get the Job Application Tracker up and running.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- pnpm (recommended) or npm

### Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd job-tracker
pnpm install
```

## Step 2: Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL if you haven't already
2. Create a database:

```bash
createdb jobtracker
```

3. Update `.env` with your database connection string:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/jobtracker
```

### Option B: Docker PostgreSQL

```bash
docker run --name jobtracker-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=jobtracker \
  -p 5432:5432 \
  -d postgres:14
```

## Step 3: Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/jobtracker
API_BASE_URL=http://localhost:4000
WEB_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Step 4: Database Migration

Generate Prisma client and push the schema:

```bash
pnpm db:push
```

This will create all the necessary tables.

## Step 5: (Optional) Seed Sample Data

```bash
pnpm seed
```

This will create a sample user and a few applications for testing.

## Step 6: Start Development Servers

Run both the API and web servers:

```bash
pnpm dev
```

This will start:
- API server on http://localhost:4000
- Web app on http://localhost:3000

## Step 7: Test the Application

1. Open http://localhost:3000 in your browser
2. You should see the application list (empty or with seed data)
3. Click "Add Application" to manually add a job application
4. Try the bookmarklet by visiting `/bookmarklet`

## Email Integration (Optional)

To enable email auto-capture from Gmail and Outlook, you need to set up OAuth credentials.

### Gmail Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy the Client ID and Client Secret to `.env`:

```env
GMAIL_CLIENT_ID=your_client_id_here
GMAIL_CLIENT_SECRET=your_client_secret_here
```

### Outlook/Microsoft Graph Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Add API permissions for `Mail.Read`
4. Create a client secret
5. Copy the Application (client) ID and secret to `.env`:

```env
OUTLOOK_CLIENT_ID=your_client_id_here
OUTLOOK_CLIENT_SECRET=your_client_secret_here
```

## Testing Email Parsing

You can test the email parsers with the included fixtures:

```bash
# Test with Greenhouse sample
curl -X POST http://localhost:4000/webhooks/gmail \
  -H "Content-Type: application/json" \
  -d @packages/parsers/fixtures/greenhouse-sample.json
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run API tests only
pnpm test:api

# Run e2e tests
pnpm test:e2e
```

## Production Build

```bash
# Build all packages
pnpm build

# Start production servers
cd apps/api && pnpm start
cd apps/web && pnpm start
```

## PWA Installation

On mobile devices:
1. Visit the web app in Chrome/Safari
2. Look for "Add to Home Screen" prompt
3. Once installed, you can share job postings directly to the app

## Troubleshooting

### Database connection errors

- Make sure PostgreSQL is running
- Check that the DATABASE_URL is correct
- Try connecting with `psql` to verify credentials

### Port conflicts

If ports 3000 or 4000 are in use:
- Change PORT in the API: `PORT=4001 pnpm dev`
- Change Next.js port: `next dev -p 3001`

### Prisma errors

If you get Prisma client errors:
```bash
cd packages/db
pnpm db:generate
```

### Build errors

Clear all node_modules and rebuild:
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
pnpm build
```

## Development Tips

### Database Studio

View and edit your database with Prisma Studio:
```bash
pnpm db:studio
```

### Watch Mode

For development with auto-reload:
```bash
# Terminal 1: API with auto-reload
cd apps/api
pnpm dev

# Terminal 2: Web with hot-reload
cd apps/web
pnpm dev
```

### Trigger Follow-up Sweep Manually

```bash
curl -X POST http://localhost:4000/followups/sweep
```

## Next Steps

- Set up email OAuth for automatic capture
- Configure cron job for production follow-up sweep
- Deploy to Vercel (web) + Railway/Render (API + DB)
- Add custom domain
- Set up monitoring and logging

## Support

For issues and questions, please check:
- README.md for API examples
- GitHub Issues (if available)
- Project documentation

