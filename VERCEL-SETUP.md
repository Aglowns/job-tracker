# Deploy Job Tracker to Vercel with PostgreSQL

This guide will help you deploy the Job Tracker to Vercel with Vercel Postgres.

## 🚀 Quick Setup

### 1. Push to GitHub

First, push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/job-tracker.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `job-tracker` repository
4. Vercel will auto-detect it's a monorepo

### 3. Configure Project Settings

**Root Directory:** `apps/web`
**Build Command:** `cd ../.. && pnpm install && pnpm build`
**Output Directory:** `.next`
**Install Command:** `cd ../.. && pnpm install`

### 4. Add Vercel Postgres

1. In your Vercel project dashboard, go to "Storage"
2. Click "Create Database" → "Postgres"
3. Choose a name (e.g., `job-tracker-db`)
4. Copy the connection string

### 5. Set Environment Variables

In Vercel project settings → Environment Variables, add:

```
DATABASE_URL=postgres://default:[password]@[host]:[port]/verceldb?sslmode=require
API_BASE_URL=https://your-api-url.vercel.app
WEB_BASE_URL=https://your-web-url.vercel.app
NEXT_PUBLIC_API_URL=https://your-api-url.vercel.app
NODE_ENV=production
```

## 📦 Deploy Both Apps

### Deploy Web App (Next.js)

1. In Vercel dashboard, your web app should auto-deploy
2. Make sure the environment variables are set
3. The app will be available at `https://yourproject.vercel.app`

### Deploy API (Express)

You have two options:

#### Option A: Vercel Serverless Functions (Recommended)

Create `apps/web/src/app/api/` routes to replace the Express API:

1. Move API logic to Next.js API routes
2. Deploy as a single Vercel project
3. Simpler deployment and management

#### Option B: Separate Vercel Project for API

1. Create a second Vercel project
2. Set root directory to `apps/api`
3. Configure as a Node.js project
4. Deploy separately

## 🗄️ Database Setup

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Set environment variables
vercel env add DATABASE_URL

# Run database migration
npx prisma db push --schema=../../packages/db/prisma/schema.prisma

# Generate Prisma client
npx prisma generate --schema=../../packages/db/prisma/schema.prisma
```

### Option 2: Vercel Dashboard

1. Go to your project → Storage → Postgres
2. Click "Query" tab
3. Run the schema creation manually (see below)

### Option 3: Migration API Endpoint

I'll create a migration endpoint you can call once:

```bash
# After deployment, call this once
curl -X POST https://yourproject.vercel.app/api/migrate
```

## 📋 Database Schema

Here's the SQL to create the tables in Vercel Postgres:

```sql
-- Users table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Applications table
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "job_url" TEXT,
    "job_id" TEXT,
    "source" "ApplicationSource" NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'Applied',
    "needs_review" BOOLEAN NOT NULL DEFAULT false,
    "last_email_msg_id" TEXT,
    "dedupe_key" TEXT NOT NULL,
    "notes" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- Followups table
CREATE TABLE "Followup" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "kind" "FollowupKind" NOT NULL,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Followup_pkey" PRIMARY KEY ("id")
);

-- Audit logs table
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payload_hash" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- Enums
CREATE TYPE "ApplicationSource" AS ENUM ('Email', 'Share', 'Bookmarklet');
CREATE TYPE "ApplicationStatus" AS ENUM ('Applied', 'PhoneScreen', 'Interview', 'Offer', 'Rejected', 'Ghosted');
CREATE TYPE "FollowupKind" AS ENUM ('+7d', '+14d');

-- Indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Application_dedupe_key_key" ON "Application"("dedupe_key");
CREATE INDEX "Application_user_id_idx" ON "Application"("user_id");
CREATE INDEX "Application_status_idx" ON "Application"("status");
CREATE INDEX "Application_applied_at_idx" ON "Application"("applied_at");
CREATE INDEX "Application_company_idx" ON "Application"("company");
CREATE INDEX "Followup_application_id_idx" ON "Followup"("application_id");
CREATE INDEX "Followup_due_at_idx" ON "Followup"("due_at");
CREATE INDEX "Followup_sent_at_idx" ON "Followup"("sent_at");
CREATE INDEX "AuditLog_created_at_idx" ON "AuditLog"("created_at");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- Foreign keys
ALTER TABLE "Application" ADD CONSTRAINT "Application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

## 🔧 Configuration Files

### Update `apps/web/vercel.json`

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

### Update `apps/web/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@job-tracker/shared'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  }
}

module.exports = nextConfig
```

## 🚀 Deployment Steps

### 1. Prepare the Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Deploy Web App

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure as above
5. Deploy!

### 3. Set Up Database

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Add environment variable
vercel env add DATABASE_URL

# Run migration (from project root)
npx prisma db push --schema=packages/db/prisma/schema.prisma
```

### 4. Test the Deployment

Visit your Vercel URL and test:

```bash
# Test the app
curl https://yourproject.vercel.app

# Test API (if you created API routes)
curl https://yourproject.vercel.app/api/applications
```

## 🔐 Environment Variables in Vercel

Required environment variables:

- `DATABASE_URL` - From Vercel Postgres
- `NEXT_PUBLIC_API_URL` - Your Vercel app URL
- `NODE_ENV=production`

Optional (for email features):
- `GMAIL_CLIENT_ID`
- `GMAIL_CLIENT_SECRET`
- `OUTLOOK_CLIENT_ID`
- `OUTLOOK_CLIENT_SECRET`

## 📊 Monitoring

After deployment:

1. Check Vercel dashboard for build logs
2. Monitor database usage in Vercel Storage
3. Set up error tracking (Sentry recommended)

## 🔄 Updates

To update your deployment:

```bash
git add .
git commit -m "Update app"
git push
```

Vercel will automatically redeploy!

## 💡 Tips

1. **Database Connection**: Vercel Postgres uses connection pooling
2. **Cold Starts**: First requests might be slower
3. **Environment Variables**: Set them in Vercel dashboard
4. **Logs**: Check Vercel dashboard for runtime logs
5. **Domain**: You can add a custom domain in Vercel settings

## 🆘 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify environment variables are set
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Prisma client generation
- Ensure database is created in Vercel

### API Routes Not Working
- Check Next.js API route structure
- Verify request/response handling
- Check Vercel function logs

## 🎉 You're Done!

Your Job Tracker is now deployed on Vercel with PostgreSQL! 

- **Web App**: `https://yourproject.vercel.app`
- **Database**: Managed by Vercel Postgres
- **Auto-deploy**: Push to GitHub to update

Want me to help you with any specific part of the deployment?
