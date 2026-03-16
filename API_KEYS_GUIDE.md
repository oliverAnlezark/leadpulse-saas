# LeadPulse API Keys Acquisition Guide

This guide walks you through obtaining all required API keys for LeadPulse production deployment.

## 1. OpenAI GPT-4 API Key

**Purpose:** AI-powered lead responses and qualification

### Steps:
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in with your account
3. Navigate to **API keys** → **Create new secret key**
4. Copy the key (starts with `sk-`)
5. Add to `.env`:
```
OPENAI_API_KEY=sk-your-key-here
```

**Cost:** Pay-as-you-go ($0.003 per 1K input tokens, $0.006 per 1K output tokens for GPT-4)

**Testing:** The API will be called when:
- Agent registers and system generates qualification questions
- Lead is received and AI generates response
- Lead is qualified with GPT-4 analysis

---

## 2. Twilio SMS API

**Purpose:** Send SMS follow-up messages to leads

### Steps:
1. Go to [Twilio Console](https://www.twilio.com/console)
2. Sign up (free trial with $15 credit)
3. Navigate to **Account** → **API Keys & tokens**
4. Copy your **Account SID** and **Auth Token**
5. Go to **Phone Numbers** → **Manage** → **Active Numbers**
6. Copy your Twilio phone number (or purchase one)
7. Add to `.env`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Cost:** $0.0075 per SMS in Australia (free trial includes $15 credit)

**Testing:** SMS will be sent when:
- Agent configures Twilio credentials in Settings
- Follow-up sequence includes SMS step
- Lead receives automated SMS message

---

## 3. SendGrid Email API

**Purpose:** Send email follow-up messages to leads

### Steps:
1. Go to [SendGrid](https://sendgrid.com)
2. Sign up (free tier: 100 emails/day)
3. Navigate to **Settings** → **API Keys**
4. Click **Create API Key**
5. Name it "LeadPulse"
6. Select "Full Access"
7. Copy the key
8. Add to `.env`:
```
SENDGRID_API_KEY=SG-your_key_here
```

**Cost:** Free tier (100/day), Paid starts at $19.95/month

**Testing:** Emails will be sent when:
- Agent configures SendGrid in Settings
- Follow-up sequence includes email step
- Lead receives automated email message

---

## 4. Stripe Payment API

**Purpose:** Handle subscription billing ($100/month)

### Steps:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up (no upfront cost)
3. Navigate to **Developers** → **API Keys**
4. Copy **Secret Key** (starts with `sk_test_` for testing)
5. Copy **Publishable Key** (starts with `pk_test_`)
6. Go to **Webhooks** → **Add endpoint**
   - URL: `https://your-domain.com/api/billing/webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
7. Copy the **Signing Secret**
8. Add to `.env`:
```
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

**Cost:** 2.9% + $0.30 per transaction (Australian transactions)

**Testing:** Stripe will process when:
- Agent clicks "Subscribe Now" on Billing page
- Redirects to Stripe checkout
- Payment processed (use test card: 4242 4242 4242 4242)
- Webhook confirms subscription activation

---

## 5. HubSpot CRM API

**Purpose:** Sync leads to HubSpot CRM

### Steps:
1. Go to [HubSpot](https://www.hubspot.com)
2. Sign up for free account
3. Navigate to **Settings** → **Integrations** → **Private apps**
4. Click **Create app**
5. Name: "LeadPulse"
6. Go to **Scopes** tab
7. Select:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
8. Click **Create app**
9. Copy the **Access Token**
10. Add to `.env`:
```
HUBSPOT_API_KEY=pat-your_access_token_here
```

**Cost:** Free tier available

**Testing:** HubSpot sync will occur when:
- Agent adds HubSpot integration in Settings
- Lead is created via webhook
- Lead status is updated
- Contact appears in HubSpot CRM

---

## 6. Real Estate View CRM API (Optional)

**Purpose:** Sync leads to Real Estate View CRM

### Steps:
1. Contact Real Estate View sales team
2. Request API documentation and credentials
3. Obtain:
   - API Key
   - Account ID
4. Add to `.env`:
```
REAL_ESTATE_VIEW_API_KEY=your_key_here
REAL_ESTATE_VIEW_ACCOUNT_ID=your_account_id
```

**Cost:** Varies by plan

---

## Testing Checklist

### ✅ Authentication Flow
```bash
# Register new agent
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@example.com",
    "password": "SecurePassword123",
    "fullName": "John Doe",
    "companyName": "Real Estate Co",
    "phone": "+61 2 XXXX XXXX"
  }'

# Response includes JWT token
```

### ✅ Lead Intake via Webhook
```bash
# Send lead from website form
curl -X POST http://localhost:3000/api/webhook/leads/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+61 2 XXXX XXXX",
    "propertyInterest": "Apartment",
    "budgetMin": 500000,
    "budgetMax": 750000,
    "timeline": "3 months",
    "source": "website"
  }'
```

### ✅ AI Response Generation
```bash
# Requires OPENAI_API_KEY in .env
# Automatically triggered on lead creation
# Check database for AI response in lead_conversations table
```

### ✅ Lead Qualification
```bash
# Qualify a lead with GPT-4
curl -X POST http://localhost:3000/api/qualification/leads/1/qualify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": {
      "timeline": "3 months",
      "motivation": "Relocating for work",
      "flexibility": "High"
    }
  }'
```

### ✅ Follow-Up Sequence Creation
```bash
# Create sequence
curl -X POST http://localhost:3000/api/sequences \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "First-Time Buyer",
    "description": "Sequence for first-time home buyers",
    "templateType": "first_time_buyer",
    "steps": [
      {
        "delayHours": 0,
        "messageType": "email",
        "subject": "Thank you for your inquiry",
        "body": "We are excited to help you find your perfect home..."
      }
    ]
  }'
```

### ✅ CRM Integration
```bash
# Add HubSpot integration
curl -X POST http://localhost:3000/api/crm/integrations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "crmType": "hubspot",
    "apiKey": "pat-your-hubspot-key",
    "accountId": "your-account-id"
  }'

# Sync lead to HubSpot
curl -X POST http://localhost:3000/api/crm/sync/hubspot \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"leadId": 1}'
```

### ✅ Stripe Subscription
```bash
# Create checkout session
curl -X POST http://localhost:3000/api/billing/checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "agent@example.com"}'

# Response includes Stripe checkout URL
# Use test card: 4242 4242 4242 4242
```

### ✅ Analytics
```bash
# Get dashboard metrics
curl -X GET http://localhost:3000/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Environment Variables Template

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/leadpulse

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production

# AI
OPENAI_API_KEY=sk-your-openai-key

# Communications
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+61XXXXXXXXX
SENDGRID_API_KEY=SG-your_sendgrid_key

# Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CRM
HUBSPOT_API_KEY=pat-your-hubspot-key

# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
```

---

## Troubleshooting

### OpenAI API Errors
- **Invalid API key:** Check key starts with `sk-`
- **Rate limit:** Free tier has 3 requests/minute limit
- **Solution:** Upgrade to paid tier for production

### Twilio SMS Not Sending
- **Invalid phone number:** Must include country code (+61 for Australia)
- **Insufficient credits:** Free trial has $15 limit
- **Solution:** Add payment method for production

### SendGrid Email Not Sending
- **Sender not verified:** Verify sender email in SendGrid dashboard
- **Rate limit:** Free tier limited to 100/day
- **Solution:** Upgrade to paid tier for production

### Stripe Webhook Not Triggering
- **Wrong endpoint URL:** Must be publicly accessible HTTPS
- **Missing events:** Ensure all required events are selected
- **Solution:** Use ngrok for local testing: `ngrok http 5000`

### HubSpot Sync Failing
- **Invalid API key:** Verify key format and permissions
- **Missing scopes:** Ensure app has contact read/write permissions
- **Solution:** Regenerate API key with correct scopes

---

## Security Best Practices

1. **Never commit `.env` to Git** - Add to `.gitignore`
2. **Rotate API keys regularly** - Every 90 days minimum
3. **Use environment-specific keys** - Test keys for development, live keys for production
4. **Monitor API usage** - Set up billing alerts in each service
5. **Restrict API key permissions** - Only grant necessary scopes
6. **Use HTTPS only** - All API calls must be encrypted
7. **Implement rate limiting** - Protect against abuse
8. **Log API errors** - Monitor for suspicious activity

---

## Support

- **OpenAI:** https://help.openai.com
- **Twilio:** https://www.twilio.com/docs
- **SendGrid:** https://docs.sendgrid.com
- **Stripe:** https://stripe.com/docs
- **HubSpot:** https://developers.hubspot.com

For LeadPulse support, contact: support@leadpulse.com.au
