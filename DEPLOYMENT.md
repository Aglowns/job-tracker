# Deployment Guide

This guide covers deploying the Job Application Tracker to production.

## Architecture Overview

- **Web App**: Next.js 14 (Server Components + API Routes)
- **API Server**: Express.js
- **Database**: PostgreSQL
- **Cron Jobs**: node-cron (runs in API server)

## Recommended Deployment Stack

### Option 1: Vercel + Railway

**Web (Vercel):**
- Deploy Next.js app to Vercel
- Auto-deploy from GitHub
- Free tier available

**API + DB (Railway):**
- Deploy API and PostgreSQL on Railway
- Automatic HTTPS
- Easy environment variables

### Option 2: All-in-One (Render)

Deploy everything on Render:
- Web Service: Next.js
- Web Service: Express API
- PostgreSQL: Managed database

### Option 3: Self-Hosted (VPS)

Use a VPS (DigitalOcean, Linode, etc.):
- Docker Compose setup
- Nginx reverse proxy
- Let's Encrypt SSL

## Vercel + Railway Deployment

### 1. Database (Railway)

1. Sign up at [Railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the DATABASE_URL from Railway dashboard

### 2. API (Railway)

1. In the same Railway project, add a new service
2. Connect your GitHub repository
3. Set root directory to `apps/api`
4. Add environment variables:

```
DATABASE_URL=<from railway postgres>
API_BASE_URL=https://your-api.railway.app
WEB_BASE_URL=https://your-app.vercel.app
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
NODE_ENV=production
```

5. Set build command:
```bash
pnpm install && pnpm build
```

6. Set start command:
```bash
cd apps/api && pnpm start
```

7. Deploy and note the public URL

### 3. Web (Vercel)

1. Sign up at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `apps/web`
4. Add environment variables:

```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
DATABASE_URL=<from railway postgres>
```

5. Deploy

### 4. Update CORS

Update API to allow your Vercel domain:

```typescript
// apps/api/src/index.ts
app.use(cors({
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:3000',
  ],
}));
```

### 5. Database Migration

Run migrations on production database:

```bash
# Set DATABASE_URL to production
DATABASE_URL="your-production-url" pnpm db:push
```

## Render Deployment (All-in-One)

### 1. Create render.yaml

```yaml
services:
  - type: web
    name: job-tracker-web
    env: node
    buildCommand: "pnpm install && pnpm build"
    startCommand: "cd apps/web && pnpm start"
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_API_URL
        value: https://job-tracker-api.onrender.com

  - type: web
    name: job-tracker-api
    env: node
    buildCommand: "pnpm install && pnpm build"
    startCommand: "cd apps/api && pnpm start"
    envVars:
      - key: NODE_ENV
        value: production

databases:
  - name: job-tracker-db
    plan: starter
    databaseName: jobtracker
```

### 2. Deploy

1. Push render.yaml to your repo
2. Connect repository in Render dashboard
3. Render will auto-detect and deploy

## Docker Deployment

### 1. Create Dockerfiles

**apps/api/Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["pnpm", "start"]
```

**apps/web/Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm", "start"]
```

### 2. Docker Compose

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: jobtracker
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/jobtracker
      API_BASE_URL: ${API_BASE_URL}
      WEB_BASE_URL: ${WEB_BASE_URL}
    depends_on:
      - db

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: ${API_BASE_URL}
    depends_on:
      - api

volumes:
  postgres_data:
```

### 3. Deploy

```bash
docker-compose up -d
```

## Environment Variables Checklist

Make sure all these are set in production:

- [ ] DATABASE_URL
- [ ] API_BASE_URL
- [ ] WEB_BASE_URL
- [ ] NEXT_PUBLIC_API_URL
- [ ] GMAIL_CLIENT_ID (if using Gmail)
- [ ] GMAIL_CLIENT_SECRET (if using Gmail)
- [ ] OUTLOOK_CLIENT_ID (if using Outlook)
- [ ] OUTLOOK_CLIENT_SECRET (if using Outlook)
- [ ] NODE_ENV=production

## Post-Deployment

### 1. Run Database Migrations

```bash
DATABASE_URL="your-production-url" pnpm db:push
```

### 2. Test Endpoints

```bash
# Health check
curl https://your-api-url/health

# Test application creation
curl -X POST https://your-api-url/applications \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","company":"Test Co","source":"Share"}'
```

### 3. Test Web App

- Visit your web URL
- Try creating an application
- Test the bookmarklet
- Test PWA installation on mobile

### 4. Monitor Logs

- Check API logs for errors
- Check database connections
- Monitor cron job execution

## Security Considerations

1. **Environment Variables**: Never commit secrets to git
2. **CORS**: Restrict to your domains only
3. **Rate Limiting**: Add rate limiting to API endpoints
4. **Database**: Use SSL for database connections
5. **OAuth**: Validate OAuth tokens properly
6. **HTTPS**: Always use HTTPS in production

## Scaling Considerations

### Horizontal Scaling

- API servers are stateless and can be scaled horizontally
- Use a load balancer (Nginx, AWS ALB, etc.)
- Ensure cron jobs run on only one instance

### Database

- Start with managed PostgreSQL (Railway, Render, AWS RDS)
- Add read replicas if needed
- Consider connection pooling (PgBouncer)

### Caching

- Add Redis for caching if needed
- Cache API responses
- Cache parsed email results

## Monitoring

Recommended tools:
- **Error Tracking**: Sentry
- **Logging**: LogRocket, Papertrail
- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Plausible, PostHog

## Backup

Set up automated backups:
- Railway: Automatic backups included
- Render: Automatic backups on paid plans
- Self-hosted: Use pg_dump on schedule

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Troubleshooting

### Build Failures

- Check Node.js version (must be 18+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check if database allows external connections
- Verify SSL settings if required

### CORS Errors

- Add your production domains to CORS whitelist
- Check API_BASE_URL is correct
- Verify preflight requests are handled

## Updates and Maintenance

To deploy updates:
1. Push to main branch (auto-deploys on Vercel/Railway)
2. Or manually trigger deployment in dashboard
3. Check health endpoint after deployment
4. Monitor logs for errors

Run migrations after schema changes:
```bash
DATABASE_URL="production-url" pnpm db:push
```

