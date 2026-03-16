# LeadPulse API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register
**POST** `/auth/register`

Request:
```json
{
  "email": "agent@example.com",
  "password": "securepassword",
  "fullName": "John Doe",
  "companyName": "Real Estate Co",
  "phone": "+61 2 XXXX XXXX"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "agent": {
    "id": "uuid",
    "email": "agent@example.com",
    "fullName": "John Doe",
    "companyName": "Real Estate Co"
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "agent@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "agent": { ... }
}
```

### Get Profile
**GET** `/auth/profile` (Protected)

Response:
```json
{
  "id": "uuid",
  "email": "agent@example.com",
  "fullName": "John Doe",
  "companyName": "Real Estate Co",
  "phone": "+61 2 XXXX XXXX",
  "timezone": "Australia/Sydney",
  "aiPromptTemplate": "..."
}
```

### Update Profile
**PUT** `/auth/profile` (Protected)

Request:
```json
{
  "fullName": "John Updated",
  "phone": "+61 2 YYYY YYYY",
  "timezone": "Australia/Melbourne",
  "aiPromptTemplate": "..."
}
```

---

## Lead Endpoints

### Get All Leads
**GET** `/leads` (Protected)

Query Parameters:
- `status` (optional): 'new', 'contacted', 'qualified', 'converted', 'lost'

Response:
```json
{
  "leads": [
    {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "phone": "+61 2 XXXX XXXX",
      "propertyInterest": "Apartment",
      "budget": { "min": 500000, "max": 750000 },
      "timeline": "3 months",
      "status": "qualified",
      "score": "hot",
      "leadSource": "website",
      "createdAt": "2026-03-13T10:00:00Z"
    }
  ]
}
```

### Get Single Lead
**GET** `/leads/:leadId` (Protected)

Response: Single lead object

### Update Lead Status
**PUT** `/leads/:leadId/status` (Protected)

Request:
```json
{
  "status": "qualified",
  "score": "hot"
}
```

### Delete Lead
**DELETE** `/leads/:leadId` (Protected)

---

## Webhook - Lead Intake

### Create Lead via Webhook
**POST** `/webhook/leads/:agentId`

No authentication required. Request:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+61 2 XXXX XXXX",
  "propertyInterest": "Apartment",
  "budgetMin": 500000,
  "budgetMax": 750000,
  "timeline": "3 months",
  "source": "website"
}
```

Response:
```json
{
  "id": "uuid",
  "message": "Lead created successfully",
  "aiResponse": "Thank you for your inquiry..."
}
```

---

## Follow-Up Sequences

### Get All Sequences
**GET** `/sequences` (Protected)

Response:
```json
{
  "sequences": [
    {
      "id": "uuid",
      "name": "First-Time Buyer",
      "description": "Sequence for first-time buyers",
      "templateType": "first_time_buyer",
      "stepsCount": 5,
      "createdAt": "2026-03-13T10:00:00Z"
    }
  ]
}
```

### Create Sequence
**POST** `/sequences` (Protected)

Request:
```json
{
  "name": "Custom Sequence",
  "description": "My custom follow-up sequence",
  "templateType": "custom",
  "steps": [
    {
      "delayHours": 0,
      "messageType": "email",
      "subject": "Thank you for your inquiry",
      "body": "We're excited to help you find your perfect property..."
    },
    {
      "delayHours": 24,
      "messageType": "sms",
      "body": "Hi Jane, following up on your property inquiry..."
    }
  ]
}
```

### Get Sequence Details
**GET** `/sequences/:sequenceId` (Protected)

### Update Sequence
**PUT** `/sequences/:sequenceId` (Protected)

### Delete Sequence
**DELETE** `/sequences/:sequenceId` (Protected)

---

## CRM Integrations

### Get All Integrations
**GET** `/crm/integrations` (Protected)

Response:
```json
{
  "integrations": [
    {
      "id": "uuid",
      "crmType": "hubspot",
      "isActive": true,
      "createdAt": "2026-03-13T10:00:00Z"
    }
  ]
}
```

### Add CRM Integration
**POST** `/crm/integrations` (Protected)

Request:
```json
{
  "crmType": "hubspot",
  "apiKey": "pat-your-hubspot-key",
  "apiSecret": "optional-secret",
  "accountId": "optional-account-id"
}
```

### Delete Integration
**DELETE** `/crm/integrations/:integrationId` (Protected)

### Sync Lead to HubSpot
**POST** `/crm/sync/hubspot` (Protected)

Request:
```json
{
  "leadId": "uuid"
}
```

---

## Lead Qualification

### Qualify Lead
**POST** `/qualification/leads/:leadId/qualify` (Protected)

Request:
```json
{
  "responses": {
    "timeline": "3 months",
    "motivation": "Relocating for work",
    "flexibility": "High"
  }
}
```

Response:
```json
{
  "leadId": "uuid",
  "score": "hot",
  "status": "qualified",
  "insights": "Strong buyer signal with clear timeline",
  "nextAction": "Schedule property viewing"
}
```

### Generate Qualification Questions
**POST** `/qualification/questions` (Protected)

Request:
```json
{
  "propertyInterest": "Apartment"
}
```

Response:
```json
{
  "questions": [
    {
      "question": "What is your budget range?",
      "type": "text"
    },
    {
      "question": "When are you looking to purchase?",
      "type": "date"
    }
  ]
}
```

### Score Lead Quality
**POST** `/qualification/leads/:leadId/score` (Protected)

Response:
```json
{
  "leadId": "uuid",
  "qualityScore": 85,
  "scoreLevel": "hot"
}
```

---

## Analytics

### Get Dashboard Metrics
**GET** `/analytics/dashboard` (Protected)

Response:
```json
{
  "leads": {
    "total": 45,
    "qualified": 12,
    "converted": 3,
    "hot": 8
  },
  "communications": [
    {
      "type": "email",
      "sent": 120,
      "delivered": 118
    },
    {
      "type": "sms",
      "sent": 45,
      "delivered": 44
    }
  ],
  "responseTime": {
    "average": 15,
    "min": 2,
    "max": 120
  }
}
```

### Get Lead Sources
**GET** `/analytics/lead-sources` (Protected)

Response:
```json
{
  "sources": [
    { "source": "website", "leads": 25 },
    { "source": "facebook", "leads": 15 },
    { "source": "referral", "leads": 5 }
  ]
}
```

### Get Conversion Funnel
**GET** `/analytics/funnel` (Protected)

Response:
```json
{
  "funnel": [
    { "status": "new", "count": 45 },
    { "status": "contacted", "count": 35 },
    { "status": "qualified", "count": 12 },
    { "status": "converted", "count": 3 }
  ]
}
```

---

## Billing

### Create Checkout Session
**POST** `/billing/checkout` (Protected)

Request:
```json
{
  "email": "agent@example.com"
}
```

Response:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### Get Subscription Status
**GET** `/billing/subscription` (Protected)

Response:
```json
{
  "customerId": "cus_...",
  "status": "active",
  "endDate": "2026-04-13T10:00:00Z"
}
```

### Cancel Subscription
**POST** `/billing/subscription/cancel` (Protected)

Response:
```json
{
  "success": true,
  "message": "Subscription cancelled"
}
```

### Webhook - Stripe Events
**POST** `/billing/webhook`

Handles:
- `checkout.session.completed` - Activate subscription
- `invoice.payment_succeeded` - Renew subscription
- `customer.subscription.deleted` - Cancel subscription

---

## Error Responses

All errors return appropriate HTTP status codes with error messages:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common status codes:
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

---

## Rate Limiting

API requests are rate limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated endpoints

---

## Webhooks

### Lead Intake Webhook
Send leads from your website form to:
```
POST https://your-domain.com/api/webhook/leads/{agentId}
```

### Stripe Webhook
Configure in Stripe dashboard to:
```
POST https://your-domain.com/api/billing/webhook
```

Required events:
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`
