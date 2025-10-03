# Testing Without Database Setup

Want to explore the project before setting up PostgreSQL? Here's what you can test!

## ✅ What Works Without Database

### 1. Email Parser Tests (Recommended!)

The parsers are fully self-contained and don't need any database:

```bash
# Install dependencies
pnpm install

# Run parser tests with sample emails
cd packages/parsers
pnpm test
```

**What this tests:**
- ✅ Greenhouse email parsing
- ✅ Lever email parsing  
- ✅ Workday email parsing
- ✅ Generic fallback parsing
- ✅ Confidence scoring
- ✅ Shared content parsing (PWA/Bookmarklet)

### 2. View Sample Email Fixtures

Check out the sample emails we test against:

```bash
# View the fixtures
cat packages/parsers/fixtures/greenhouse-sample.json
cat packages/parsers/fixtures/lever-sample.json
cat packages/parsers/fixtures/workday-sample.json
cat packages/parsers/fixtures/generic-sample.json
```

### 3. Quick Parser Preview

```bash
# Run the quick test script
node test-parsers.js
```

This shows what each sample email should parse to.

### 4. Explore Static Web Pages

Some pages work without the API:

```bash
# Start just the web frontend
cd apps/web
pnpm dev
```

Visit these pages (they work without database):
- ✅ http://localhost:3000/bookmarklet - Full bookmarklet setup
- ✅ http://localhost:3000/capture - Capture form (UI only)

**Note:** The home page `/` will try to fetch data from the API, so it won't fully work without the database.

### 5. Check the Code Structure

Browse the codebase:

```bash
# See what parsers are available
ls packages/parsers/src/

# Check API routes
ls apps/api/src/routes/

# View React components
ls apps/web/src/components/

# See database schema
cat packages/db/prisma/schema.prisma
```

### 6. Validate Your Environment

Check if the environment validation works:

```bash
# This will validate .env without actually connecting
cd apps/api
pnpm build
```

It will tell you if any required environment variables are missing.

## ❌ What Needs Database

These features require PostgreSQL to be set up:

- ❌ Running the API server (`apps/api`)
- ❌ Creating/viewing applications
- ❌ Testing webhooks
- ❌ Testing follow-ups
- ❌ Home page application list
- ❌ Application detail pages

## 🎯 Recommended Testing Flow

**Without Database:**
1. Install dependencies: `pnpm install`
2. Run parser tests: `cd packages/parsers && pnpm test`
3. View bookmarklet page: `cd apps/web && pnpm dev`
4. Explore the code and fixtures

**With Database (Full Experience):**
1. Set up PostgreSQL: `createdb jobtracker`
2. Run migrations: `pnpm db:push`
3. Seed data: `pnpm seed`
4. Start everything: `pnpm dev`
5. Test full workflow

## 📊 Test Coverage

**Without Database:**
- ✅ ~40% of functionality (all parsing logic)
- ✅ Unit tests for parsers
- ✅ Static UI pages
- ✅ Type checking
- ✅ Code structure exploration

**With Database:**
- ✅ 100% of functionality
- ✅ Full API testing
- ✅ E2E tests
- ✅ Integration tests
- ✅ Complete user workflows

## 💡 Quick Commands

```bash
# Test parsers (no DB)
pnpm install && cd packages/parsers && pnpm test

# View fixtures
cat packages/parsers/fixtures/*.json

# Build shared packages (no DB)
cd packages/shared && pnpm build

# Check types (no DB)
pnpm build

# View bookmarklet (no DB)
cd apps/web && pnpm dev
# Visit: http://localhost:3000/bookmarklet
```

## 🚀 Next Steps

Once you've explored without database and want the full experience:

1. Install PostgreSQL:
   - **Mac**: `brew install postgresql`
   - **Windows**: Download from postgresql.org
   - **Linux**: `sudo apt install postgresql`

2. Follow [QUICKSTART.md](./QUICKSTART.md) for full setup

3. Or use Docker:
   ```bash
   docker run --name jobtracker-db \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=jobtracker \
     -p 5432:5432 -d postgres:14
   ```

## 🎉 Benefits of Testing Parsers First

- ✅ See the core functionality immediately
- ✅ Understand how email parsing works
- ✅ No database installation needed
- ✅ Fast feedback loop
- ✅ Confidence before full setup

The email parsers are the heart of the application - they're what makes auto-capture work!

