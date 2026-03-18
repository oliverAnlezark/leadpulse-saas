# Vault CRM Integration Setup Guide

## Overview

LeadPulse now supports real-time lead syncing from MRI Vault CRM. When leads arrive from REA Group or Domain in your Vault CRM account, they automatically appear in LeadPulse for instant response and follow-up automation.

## How It Works

1. **Lead arrives in Vault CRM** (from REA Group, Domain, or manual entry)
2. **Vault sends webhook to LeadPulse** (`/api/vault-webhook`)
3. **LeadPulse creates/updates the lead** in the database
4. **Lead appears in LeadPulse dashboard** ready for AI response and follow-up

## Prerequisites

- Active Vault CRM account with API access
- LeadPulse account with admin access
- Your LeadPulse domain (e.g., `leadpulse-saas-production.up.railway.app`)

## Setup Instructions

### Step 1: Get Your Vault CRM API Token

1. Log into your Vault CRM account
2. Go to **Office Integrations** → **Third Party Access**
3. Click **Add Token** and select **LeadPulse**
4. Copy the generated API token (save this securely)

### Step 2: Register Your Vault Integration in LeadPulse

You need to store your Vault API token in LeadPulse so it can verify incoming webhooks.

**Via Database (Admin):**
```sql
INSERT INTO vault_integrations (agent_id, vault_api_token, is_active)
VALUES (1, 'your-vault-api-token-here', true);
```

Replace:
- `1` with your agent ID in LeadPulse
- `'your-vault-api-token-here'` with your actual Vault API token

### Step 3: Configure Vault CRM Webhook

1. In Vault CRM, go to **Office Integrations** → **Webhooks**
2. Click **Create New Webhook**
3. Fill in the following:
   - **Webhook URL:** `https://leadpulse-saas-production.up.railway.app/api/vault-webhook`
   - **Event Type:** Select both:
     - `lead.created` (when new lead arrives)
     - `lead.updated` (when lead is modified)
   - **Authentication:** Add custom header:
     - Header Name: `x-vault-api-token`
     - Header Value: Your Vault API token from Step 1
4. Click **Save and Test**

### Step 4: Test the Integration

#### Test 1: Vault's Built-in Test

In Vault CRM webhook settings, click **Send Test Event**. You should see:
- HTTP Status: `201` (for new lead) or `200` (for update)
- Response includes `leadId` and `vaultLeadId`

#### Test 2: Manual Webhook Test

Use `curl` to send a test webhook:

```bash
curl -X POST https://leadpulse-saas-production.up.railway.app/api/vault-webhook \
  -H "Content-Type: application/json" \
  -H "x-vault-api-token: your-vault-api-token" \
  -d '{
    "event": "lead.created",
    "data": {
      "id": "vault-test-001",
      "firstName": "Test",
      "lastName": "Lead",
      "email": "test@example.com",
      "phone": "+61 400 000 000",
      "propertyAddress": "123 Test St, Sydney NSW 2000",
      "propertyType": "house",
      "buyingOrSelling": "buying",
      "budget": "$500k-$750k",
      "timeline": "ASAP",
      "source": "rea"
    }
  }'
```

Expected response:
```json
{
  "message": "Lead created successfully",
  "leadId": 123,
  "vaultLeadId": "vault-test-001",
  "action": "created"
}
```

#### Test 3: Check LeadPulse Dashboard

1. Log into LeadPulse
2. Go to **Leads** section
3. You should see the test lead appear within seconds

## Webhook Payload Format

Vault CRM sends the following JSON structure:

```json
{
  "event": "lead.created",
  "data": {
    "id": "vault-lead-12345",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "phone": "+61 400 000 000",
    "propertyAddress": "123 Main St, Sydney NSW 2000",
    "propertyType": "house",
    "buyingOrSelling": "buying",
    "budget": "$500k-$750k",
    "timeline": "ASAP",
    "source": "rea"
  },
  "timestamp": 1710768000,
  "signature": "sha256=..."
}
```

## Lead Status Workflow

| Status | Meaning | Next Action |
|--------|---------|------------|
| **new** | Lead just arrived | AI sends initial response |
| **warm** | Lead shows interest | Schedule agent call |
| **qualified** | Lead meets criteria | Add to follow-up sequence |
| **converted** | Lead became a client | Archive or add to post-close |
| **lost** | Lead won't convert | Archive with notes |

## Troubleshooting

### Leads not appearing in LeadPulse

**Check 1: Webhook is being sent**
- In Vault CRM, go to **Webhooks** → **Logs**
- Look for recent webhook deliveries
- Check the HTTP response code (should be 201 for new, 200 for updates)

**Check 2: API token is correct**
- Verify the `x-vault-api-token` header matches your Vault API token
- Check that the token hasn't expired in Vault

**Check 3: Webhook URL is correct**
- Verify the URL in Vault matches your actual LeadPulse domain
- Test with the curl command above

**Check 4: Agent ID is correct**
- Verify you inserted the correct `agent_id` in the `vault_integrations` table
- Check that the agent exists in the `agents` table

### Duplicate leads appearing

This can happen if:
- The webhook is being sent multiple times
- The lead already exists and is being updated

**Solution:** LeadPulse checks for duplicates using the Vault lead ID. If you see duplicates, check the webhook logs in Vault CRM.

### Leads have incomplete information

Vault may not send all fields for every lead. LeadPulse handles this gracefully:
- Missing fields are left blank
- You can manually fill them in the LeadPulse dashboard
- The lead will still trigger AI response and follow-up sequences

## Database Schema

### vault_integrations table

Stores the mapping between LeadPulse agents and their Vault CRM API tokens:

```sql
CREATE TABLE vault_integrations (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES agents(id),
  vault_api_token VARCHAR(500) NOT NULL,
  vault_account_id VARCHAR(255),
  webhook_secret VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### leads table (updated)

New columns added to track Vault integration:
- `source_system` - Where the lead came from (vault, manual, etc.)
- `vault_lead_id` - The unique ID from Vault CRM
- `external_lead_id` - Generic field for other CRM systems

## API Endpoints

### POST /api/vault-webhook

Receives webhook notifications from Vault CRM.

**Headers:**
```
Content-Type: application/json
x-vault-api-token: your-vault-api-token
```

**Request Body:**
```json
{
  "event": "lead.created",
  "data": { ... },
  "timestamp": 1710768000,
  "signature": "sha256=..."
}
```

**Response (201 - New Lead Created):**
```json
{
  "message": "Lead created successfully",
  "leadId": 123,
  "vaultLeadId": "vault-lead-12345",
  "action": "created"
}
```

**Response (200 - Lead Updated):**
```json
{
  "message": "Lead updated successfully",
  "leadId": 123,
  "vaultLeadId": "vault-lead-12345",
  "action": "updated"
}
```

**Response (200 - Lead Already Exists):**
```json
{
  "message": "Lead already exists",
  "leadId": 123,
  "action": "skipped"
}
```

## Security Considerations

- Your Vault API token is stored in the database and should be treated as a secret
- Webhooks are sent over HTTPS only
- Each webhook includes the API token in the header for verification
- Never commit your API token to version control
- Use environment variables or secure vaults to manage tokens in production

## Next Steps

1. **Complete the setup** above (Steps 1-4)
2. **Test with a real lead** from Vault CRM
3. **Monitor the dashboard** to see leads appear in real-time
4. **Configure AI responses** in LeadPulse settings
5. **Set up follow-up sequences** to automate nurturing

## Support

For issues or questions:
- Check the troubleshooting section above
- Review webhook logs in Vault CRM
- Check LeadPulse server logs for error messages
- Contact LeadPulse support

## Webhook Event Types

### lead.created

Sent when a new lead arrives in Vault CRM from:
- REA Group inquiry
- Domain inquiry
- Manual entry
- Other integrations

### lead.updated

Sent when an existing lead's details are modified:
- Contact information updated
- Property details changed
- Status changed
- Custom fields updated

Both events trigger the same webhook endpoint and are handled identically.
