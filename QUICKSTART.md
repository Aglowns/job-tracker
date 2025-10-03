# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL running on localhost:5432
- pnpm installed (`npm install -g pnpm`)

## Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment

```bash
cp env.example .env
# Edit .env if needed (defaults should work for local development)
```

### 3. Setup Database

```bash
# Create database
createdb jobtracker

# Run migrations
pnpm db:push
```

### 4. (Optional) Add Sample Data

```bash
pnpm seed
```

### 5. Start Development Servers

```bash
pnpm dev
```

This starts:
- API: http://localhost:4000
- Web: http://localhost:3000

### 6. Open in Browser

Visit http://localhost:3000

## Test the Features

### Manual Entry
1. Click "Add Application"
2. Fill in the form
3. Save

### Test Email Parsing
```bash
curl -X POST http://localhost:4000/webhooks/gmail \
  -H "Content-Type: application/json" \
  -d @packages/parsers/fixtures/greenhouse-sample.json
```

Refresh the browser to see the new application!

### Test Bookmarklet
1. Visit http://localhost:3000/bookmarklet
2. Drag the bookmarklet to your bookmarks bar
3. Visit any job posting
4. Click the bookmarklet

## Next Steps

- See SETUP.md for detailed setup instructions
- See README.md for API documentation
- See DEPLOYMENT.md for production deployment

## Troubleshooting

**Database connection failed?**
- Make sure PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env

**Port already in use?**
- Kill the process using the port or change it in package.json

**Prisma errors?**
```bash
cd packages/db
pnpm db:generate
```

## Quick Commands

```bash
pnpm dev          # Start dev servers
pnpm test         # Run tests
pnpm build        # Build for production
pnpm db:push      # Apply database changes
pnpm db:studio    # Open database GUI
pnpm seed         # Add sample data
```

That's it! You're ready to track job applications. 🎉

