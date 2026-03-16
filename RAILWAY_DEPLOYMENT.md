# LeadPulse Deployment Guide - Railway

This guide walks you through deploying LeadPulse to Railway, a modern cloud platform perfect for Node.js + PostgreSQL applications.

## Why Railway?

✅ **Easiest setup** - Deploy in 10 minutes  
✅ **PostgreSQL included** - Built-in database  
✅ **Free tier available** - $5 monthly credit  
✅ **GitHub integration** - Auto-deploy on push  
✅ **Environment variables** - Easy secrets management  
✅ **Custom domains** - Point your domain to Railway  

---

## Prerequisites

1. **GitHub account** - To connect your repository
2. **Railway account** - Free at https://railway.app
3. **Your API keys** - OpenAI, Twilio, SendGrid, Stripe, HubSpot
4. **Custom domain** (optional) - For production

---

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
cd /home/ubuntu/leadpulse-saas
git init
git add .
git commit -m "Initial LeadPulse MVP commit"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `leadpulse-saas`
3. Do NOT initialize with README (we already have files)
4. Click **Create repository**

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/leadpulse-saas.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Railway Project

### 2.1 Create New Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Authorize Railway to access your GitHub account
5. Select your `leadpulse-saas` repository
6. Click **Deploy**

Railway will automatically detect your Node.js project and start building!

### 2.2 Monitor Deployment
- Railway will build your application (takes 2-3 minutes)
- You'll see logs in real-time
- Once complete, you'll get a public URL

---

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables in Railway
1. In Railway dashboard, click your **LeadPulse project**
2. Go to **Variables** tab
3. Add each variable:

```env
# Database (Railway creates this automatically)
DATABASE_URL=postgresql://...  # Auto-generated, keep as-is

# Authentication
JWT_SECRET=your-jwt-secret-key

# AI
OPENAI_API_KEY=your-openai-api-key

# Communications
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+61XXXXXXXXX
SENDGRID_API_KEY=your-sendgrid-api-key

# Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# CRM
HUBSPOT_API_KEY=your-hubspot-api-key

# Application
NODE_ENV=production
FRONTEND_URL=https://your-railway-domain.railway.app
```

### 3.2 Add PostgreSQL Service
1. In your Railway project, click **+ New**
2. Select **Database** → **PostgreSQL**
3. Railway will create a PostgreSQL instance
4. The `DATABASE_URL` will be auto-populated

---

## Step 4: Initialize Database Schema

### 4.1 Connect to Railway PostgreSQL
Railway provides a connection string. You can run migrations two ways:

**Option A: Using Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link your project
railway link

# Run database initialization
railway run psql -d $DATABASE_URL -f db/schema.sql
```

**Option B: Using pgAdmin (Web Interface)**
1. In Railway dashboard, click your PostgreSQL service
2. Click **Connect** → **pgAdmin**
3. Open pgAdmin in browser
4. Create new database: `leadpulse`
5. Run the SQL from `db/schema.sql` in the query editor

---

## Step 5: Configure Stripe Webhook

### 5.1 Get Your Railway Domain
1. In Railway dashboard, click your **Node service**
2. Copy your public URL (e.g., `https://leadpulse-production-abc123.railway.app`)
3. This is your `FRONTEND_URL`

### 5.2 Add Stripe Webhook
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **Webhooks**
3. Click **Add endpoint**
4. **Endpoint URL:**
   ```
   https://your-railway-domain.railway.app/api/billing/webhook
   ```
5. **Events to send:**
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
6. Click **Add endpoint**
7. Copy the **Signing Secret** (starts with `whsec_`)
8. Add to Railway Variables as `STRIPE_WEBHOOK_SECRET`

---

## Step 6: Set Up Custom Domain (Optional)

### 6.1 Connect Domain to Railway
1. In Railway dashboard, click your **Node service**
2. Go to **Settings** tab
3. Scroll to **Domains**
4. Click **+ Add Domain**
5. Enter your domain (e.g., `leadpulse.com.au`)
6. Railway will provide DNS records

### 6.2 Update DNS Records
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add the DNS records provided by Railway
3. Wait 24-48 hours for DNS propagation

### 6.3 Verify Domain
1. In Railway, click **Verify** next to your domain
2. Once verified, your app is accessible at your custom domain

---

## Step 7: Test Your Deployment

### 7.1 Test Health Endpoint
```bash
curl https://your-railway-domain.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-03-13T..."}
```

### 7.2 Test Agent Registration
```bash
curl -X POST https://your-railway-domain.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "fullName": "Test Agent",
    "companyName": "Test Real Estate",
    "phone": "+61 2 1234 5678"
  }'
```

### 7.3 Test Lead Webhook
```bash
curl -X POST https://your-railway-domain.railway.app/api/webhook/leads/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+61 2 9876 5432",
    "propertyInterest": "House",
    "budgetMin": 500000,
    "budgetMax": 750000,
    "timeline": "3 months",
    "source": "website"
  }'
```

---

## Step 8: Enable Auto-Deployment

### 8.1 GitHub Integration
Railway automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Railway will automatically redeploy
```

### 8.2 View Deployment Logs
1. In Railway dashboard, click **Deployments**
2. Click any deployment to see logs
3. Scroll through to find errors or issues

---

## Monitoring & Maintenance

### 8.1 View Application Logs
```bash
railway logs
```

### 8.2 Check Database Size
```bash
railway run psql -d $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

### 8.3 Monitor Costs
1. Go to Railway dashboard
2. Click **Billing**
3. View your current usage and costs
4. Set spending limits if needed

---

## Troubleshooting

### Issue: "Deployment Failed"
**Solution:**
1. Check logs: Click **Deployments** → View failed deployment
2. Look for error messages
3. Common causes:
   - Missing environment variables
   - Syntax errors in code
   - Database connection issues

### Issue: "Cannot connect to database"
**Solution:**
1. Verify `DATABASE_URL` is set in Variables
2. Check PostgreSQL service is running
3. Run: `railway run psql -d $DATABASE_URL -c "SELECT 1;"`

### Issue: "Stripe webhook not triggering"
**Solution:**
1. Verify webhook URL is correct in Stripe dashboard
2. Check `STRIPE_WEBHOOK_SECRET` is set
3. View webhook logs in Stripe dashboard

### Issue: "API keys not working"
**Solution:**
1. Verify all environment variables are set
2. Check for typos in keys
3. Restart the application: Click **Redeploy** in Railway

### Issue: "CORS errors from frontend"
**Solution:**
1. Update `FRONTEND_URL` in environment variables
2. Ensure CORS headers are set in backend
3. Restart application

---

## Performance Optimization

### 8.1 Database Indexing
```bash
railway run psql -d $DATABASE_URL -c "
CREATE INDEX idx_leads_agent_id ON leads(agent_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_conversations_lead_id ON lead_conversations(lead_id);
"
```

### 8.2 Connection Pooling
Already configured in `server/db.js` with pg-pool

### 8.3 Caching
Consider adding Redis for session caching (optional upgrade)

---

## Scaling to Production

### 9.1 Upgrade Database
As you grow, upgrade your PostgreSQL plan:
1. In Railway, click PostgreSQL service
2. Click **Settings**
3. Upgrade to higher tier

### 9.2 Add More Dynos (Node instances)
1. Click your Node service
2. Click **Settings**
3. Increase instance count for load balancing

### 9.3 Set Up Monitoring
1. Enable application monitoring in Railway
2. Set up alerts for errors
3. Monitor API response times

---

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Configure environment variables
3. ✅ Initialize database
4. ✅ Test all endpoints
5. ✅ Set up Stripe webhook
6. ✅ Connect custom domain
7. ✅ Enable auto-deployment
8. ✅ Monitor application

---

## Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Node.js Deployment:** https://docs.railway.app/deploy/deployments
- **PostgreSQL Guide:** https://docs.railway.app/databases/postgresql
- **Custom Domains:** https://docs.railway.app/develop/domains
- **LeadPulse Support:** support@leadpulse.com.au

---

## Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] All environment variables set
- [ ] Database schema initialized
- [ ] Health endpoint tested
- [ ] Agent registration tested
- [ ] Lead webhook tested
- [ ] Stripe webhook configured
- [ ] Custom domain configured (optional)
- [ ] Auto-deployment enabled
- [ ] Monitoring set up
- [ ] Backup strategy planned

**Congratulations! LeadPulse is now live on Railway! 🚀**
