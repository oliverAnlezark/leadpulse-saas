# LeadPulse Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Setup

1. **Clone and install:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Set up database:**
```bash
createdb leadpulse
psql -d leadpulse -f db/schema.sql
```

4. **Configure environment variables:**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/leadpulse
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-your-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
SENDGRID_API_KEY=SG-your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret
HUBSPOT_API_KEY=pat-your-key
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

5. **Start development servers:**
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Docker Deployment

### Build and run with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Node.js application server

### Access:
- Application: http://localhost:5000

## Production Deployment

### Using Railway, Render, or Heroku:

1. **Set environment variables** in your hosting platform
2. **Connect your Git repository**
3. **Deploy** (automatic on push to main branch)

### Environment Variables for Production:

```env
DATABASE_URL=postgresql://user:password@host:5432/leadpulse
JWT_SECRET=<generate-strong-secret>
NODE_ENV=production
OPENAI_API_KEY=<your-key>
TWILIO_ACCOUNT_SID=<your-sid>
TWILIO_AUTH_TOKEN=<your-token>
TWILIO_PHONE_NUMBER=<your-number>
SENDGRID_API_KEY=<your-key>
STRIPE_SECRET_KEY=<your-key>
STRIPE_PUBLISHABLE_KEY=<your-key>
STRIPE_WEBHOOK_SECRET=<your-secret>
HUBSPOT_API_KEY=<your-key>
FRONTEND_URL=https://your-domain.com
```

## Database Migrations

To run migrations:
```bash
psql -d leadpulse -f db/schema.sql
```

## Monitoring

### Logs
- Backend logs: `docker-compose logs app`
- Database logs: `docker-compose logs postgres`

### Health Check
```bash
curl http://localhost:5000/health
```

## Backup & Recovery

### Backup database:
```bash
pg_dump leadpulse > backup.sql
```

### Restore database:
```bash
psql leadpulse < backup.sql
```

## Troubleshooting

### Database connection issues:
1. Check DATABASE_URL is correct
2. Verify PostgreSQL is running
3. Check network connectivity

### Stripe webhook errors:
1. Verify STRIPE_WEBHOOK_SECRET is correct
2. Check webhook endpoint in Stripe dashboard
3. Ensure FRONTEND_URL is accessible

### Email/SMS not sending:
1. Verify SendGrid/Twilio credentials
2. Check API keys have correct permissions
3. Review service logs for errors

## Performance Optimization

1. **Database indexing** - Already configured in schema.sql
2. **Caching** - Add Redis for session management
3. **CDN** - Serve static assets from CDN
4. **Rate limiting** - Implement rate limiting on API endpoints
5. **Compression** - Enable gzip compression

## Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] HTTPS is enabled in production
- [ ] Database credentials are strong
- [ ] JWT_SECRET is long and random
- [ ] Stripe webhook secret is verified
- [ ] API rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Input validation is implemented
