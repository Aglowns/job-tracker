# 🚀 Step-by-Step Deployment Guide

Let's walk through deploying your Job Tracker to Vercel with PostgreSQL!

## ✅ What We Just Did

I've converted your Express API to Next.js API routes so everything runs in one app:

- ✅ **API Routes**: All Express endpoints → Next.js API routes
- ✅ **Services**: Moved business logic to `/lib` folder  
- ✅ **Database**: Prisma client configured for Vercel
- ✅ **Dependencies**: Updated package.json with required packages

## 🎯 Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit everything
git commit -m "Convert to Next.js API routes for Vercel deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/job-tracker.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## 🎯 Step 2: Deploy to Vercel

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in with GitHub

2. **Import Project**: 
   - Click "New Project"
   - Find and select your `job-tracker` repository
   - Click "Import"

3. **Configure Project Settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install && pnpm build`
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `cd ../.. && pnpm install`

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `NODE_ENV` = `production`
   - We'll add `DATABASE_URL` after creating the database

5. **Deploy**: Click "Deploy" button

## 🎯 Step 3: Create PostgreSQL Database

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"

2. **Configure Database**:
   - Name: `job-tracker-db`
   - Region: Choose closest to you
   - Click "Create"

3. **Get Connection String**:
   - Copy the connection string (starts with `postgres://`)
   - Go back to your project settings
   - Add environment variable: `DATABASE_URL` = your connection string

4. **Redeploy**: Trigger a new deployment to pick up the environment variable

## 🎯 Step 4: Set Up Database Tables

After your app is deployed, run the migration:

```bash
# Visit your deployed app + /api/migrate
# Replace YOUR_PROJECT with your actual Vercel project name
curl -X POST https://YOUR_PROJECT.vercel.app/api/migrate
```

Or visit in browser: `https://YOUR_PROJECT.vercel.app/api/migrate` (POST request)

## 🎯 Step 5: Test Your Deployment

1. **Health Check**:
   ```bash
   curl https://YOUR_PROJECT.vercel.app/api/health
   ```

2. **Visit Your App**:
   - Open `https://YOUR_PROJECT.vercel.app`
   - You should see the Job Tracker interface

3. **Test Application Creation**:
   - Click "Add Application"
   - Fill out the form
   - Submit and verify it works

4. **Test API Endpoints**:
   ```bash
   # Test applications list
   curl https://YOUR_PROJECT.vercel.app/api/applications
   
   # Test email parsing (with sample data)
   curl -X POST https://YOUR_PROJECT.vercel.app/api/webhooks/gmail \
     -H "Content-Type: application/json" \
     -d '{"message":{"id":"123","payload":{"headers":[{"name":"Subject","value":"Application Received - Test Engineer"},{"name":"From","value":"jobs@greenhouse.io"}],"body":{"data":"VGVzdCBhcHBsaWNhdGlvbg=="}}}}'
   ```

## 🎯 Step 6: Set Up Follow-up Cron Job

For production, you'll want to set up the follow-up sweep. You can:

1. **Use Vercel Cron Jobs** (recommended):
   - Add to `vercel.json`:
   ```json
   {
     "crons": [
       {
         "path": "/api/followups/sweep",
         "schedule": "0 * * * *"
       }
     ]
   }
   ```

2. **Or use external service**:
   - UptimeRobot to ping `/api/followups/sweep` every hour
   - GitHub Actions scheduled workflow

## 🎯 Step 7: Optional - Add Email Integration

To enable Gmail/Outlook auto-capture:

1. **Set up OAuth credentials** (see README.md)
2. **Add environment variables**:
   - `GMAIL_CLIENT_ID`
   - `GMAIL_CLIENT_SECRET`
   - `OUTLOOK_CLIENT_ID`
   - `OUTLOOK_CLIENT_SECRET`

## 🎯 Step 8: Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Domains
   - Add your custom domain
   - Follow DNS setup instructions

## ✅ You're Done!

Your Job Tracker is now live at:
- **Web App**: `https://YOUR_PROJECT.vercel.app`
- **API**: `https://YOUR_PROJECT.vercel.app/api/*`
- **Database**: Managed by Vercel Postgres

## 🔧 Quick Commands for Updates

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on push!
```

## 🆘 Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify environment variables are set

### Database Issues
- Check DATABASE_URL is correct
- Verify database is created in Vercel
- Check migration endpoint response

### API Not Working
- Check Next.js API route structure
- Verify request/response handling
- Check Vercel function logs

## 📊 Monitoring

- **Vercel Dashboard**: View deployments, logs, usage
- **Database**: Monitor in Vercel Storage tab
- **Analytics**: Built into Vercel dashboard

## 🎉 Next Steps

- Set up email OAuth for auto-capture
- Add custom domain
- Set up monitoring/alerts
- Configure follow-up notifications

Your Job Tracker is now production-ready! 🚀
