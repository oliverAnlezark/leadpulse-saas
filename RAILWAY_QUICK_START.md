# Railway Deployment - Quick Start (5 Minutes)

## TL;DR - Deploy LeadPulse in 5 Steps

### Step 1: Push to GitHub
```bash
cd /home/ubuntu/leadpulse-saas
git init
git add .
git commit -m "LeadPulse MVP"
git remote add origin https://github.com/YOUR_USERNAME/leadpulse-saas.git
git push -u origin main
```

### Step 2: Create Railway Project
1. Go to https://railway.app/dashboard
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Select `leadpulse-saas`
5. Click **Deploy**

### Step 3: Add PostgreSQL
1. Click **+ New** in your project
2. Select **Database** → **PostgreSQL**
3. Wait for it to initialize

### Step 4: Set Environment Variables
In Railway dashboard, go to **Variables** and add:

```env
JWT_SECRET=your-jwt-secret-key
OPENAI_API_KEY=your-openai-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+61XXXXXXXXX
SENDGRID_API_KEY=your-sendgrid-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
HUBSPOT_API_KEY=your-hubspot-api-key
NODE_ENV=production
FRONTEND_URL=https://your-railway-domain.railway.app
```

### Step 5: Initialize Database
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run schema
railway run psql -d $DATABASE_URL -f db/schema.sql
```

**Done!** Your app is live at the Railway URL shown in your dashboard.

---

## Get Your Railway URL

1. In Railway dashboard, click your **Node service**
2. Copy the URL under **Domains**
3. Test it: `curl https://your-url.railway.app/health`

---

## Update Stripe Webhook

1. Get your Railway URL from step above
2. Go to Stripe Dashboard → Webhooks
3. Add endpoint: `https://your-url.railway.app/api/billing/webhook`
4. Copy signing secret
5. Add to Railway Variables as `STRIPE_WEBHOOK_SECRET`

---

## Test Your Deployment

```bash
# Health check
curl https://your-url.railway.app/health

# Register agent
curl -X POST https://your-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test","companyName":"Test Co","phone":"+61212345678"}'
```

---

## Next Time You Update

Just push to GitHub and Railway auto-deploys:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

For detailed guide, see: `RAILWAY_DEPLOYMENT.md`
