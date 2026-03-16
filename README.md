# LeadPulse MVP

AI-powered lead response and follow-up automation system for Australian real estate agents.

## Features

- **Instant Lead Response**: AI responds to leads within 60 seconds via email/SMS
- **Lead Qualification**: Automated qualifying questions and lead scoring
- **Follow-Up Automation**: Pre-built sequences (First-Time Buyer, Investor, Downsizer) with customization
- **Lead Intake API**: Webhook endpoint for website form integration
- **CRM Integration**: HubSpot + generic webhook support for Real Estate View, REIN, etc.
- **Communication**: Twilio (SMS) + SendGrid (email) integration
- **Analytics Dashboard**: Real-time metrics on response rates, conversions, lead sources
- **Subscription Billing**: Stripe integration ($100/month)

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4
- **Communications**: Twilio (SMS), SendGrid (email)
- **Payments**: Stripe
- **Frontend**: React (to be built)

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Environment variables (see `.env.example`)

### Installation

1. Clone repository and install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Set up database:
```bash
psql -U postgres -c "CREATE DATABASE leadpulse;"
psql -U postgres -d leadpulse -f db/schema.sql
```

4. Start development server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new agent
- `POST /api/auth/login` - Login agent
- `GET /api/auth/profile` - Get agent profile
- `PUT /api/auth/profile` - Update agent profile

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:leadId` - Get single lead
- `PUT /api/leads/:leadId/status` - Update lead status
- `DELETE /api/leads/:leadId` - Delete lead

### Webhook
- `POST /api/webhook/leads/:agentId` - Receive lead from website form

### Follow-Up Sequences
- `GET /api/sequences` - Get all sequences
- `POST /api/sequences` - Create sequence
- `GET /api/sequences/:sequenceId` - Get sequence with steps
- `PUT /api/sequences/:sequenceId` - Update sequence
- `DELETE /api/sequences/:sequenceId` - Delete sequence

### CRM Integration
- `GET /api/crm/integrations` - Get CRM integrations
- `POST /api/crm/integrations` - Add CRM integration
- `PUT /api/crm/integrations/:integrationId` - Update integration
- `DELETE /api/crm/integrations/:integrationId` - Delete integration
- `POST /api/crm/sync/hubspot` - Sync lead to HubSpot

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard metrics
- `GET /api/analytics/lead-sources` - Get lead source breakdown
- `GET /api/analytics/funnel` - Get conversion funnel

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/leadpulse
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=sk-your-openai-key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SENDGRID_API_KEY=SG.your_sendgrid_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
HUBSPOT_API_KEY=pat-your-hubspot-key
PORT=5000
NODE_ENV=development
```

## Development Roadmap

- [ ] React frontend dashboard
- [ ] Stripe subscription billing
- [ ] Real Estate View CRM integration
- [ ] REIN CRM integration
- [ ] Lead qualification workflow
- [ ] Follow-up sequence automation
- [ ] Email/SMS template builder
- [ ] Advanced analytics
- [ ] Mobile app

## License

ISC
