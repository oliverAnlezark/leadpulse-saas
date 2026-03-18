# Vault CRM Integration - Changes Summary

## Files Added

### 1. `/server/routes/vault-webhook.js`
- New Express route handler for Vault CRM webhooks
- Validates incoming webhooks using `x-vault-api-token` header
- Handles `lead.created` and `lead.updated` events
- Prevents duplicate leads by checking `vault_lead_id`
- Creates/updates leads in the database with Vault lead data

### 2. `VAULT_CRM_SETUP.md`
- Comprehensive setup guide for Vault CRM integration
- Step-by-step instructions for configuring webhooks
- Testing procedures and troubleshooting tips
- Database schema documentation
- API endpoint reference

## Files Modified

### 1. `/server/index.js`
- Added import for `vault-webhook` route
- Registered webhook endpoint at `/api/vault-webhook`

### 2. `/db/schema.sql`
- Added `vault_integrations` table to store Vault API tokens
- Added columns to `leads` table:
  - `source_system` - Track where lead came from
  - `external_lead_id` - Generic external ID field
  - `vault_lead_id` - Vault CRM lead ID
- Added indexes for performance

## How to Deploy

1. **Push changes to GitHub:**
   ```bash
   cd /home/ubuntu/leadpulse-saas
   git add -A
   git commit -m "Add Vault CRM webhook integration"
   git push origin main
   ```

2. **Railway will auto-deploy:**
   - Migrations run automatically on startup
   - New tables and columns are created
   - Webhook endpoint becomes available

3. **Configure in Vault CRM:**
   - Follow the setup guide in `VAULT_CRM_SETUP.md`
   - Add your Vault API token to the database
   - Configure webhook in Vault CRM settings

## Webhook Endpoint

**URL:** `https://leadpulse-saas-production.up.railway.app/api/vault-webhook`

**Method:** POST

**Headers Required:**
- `Content-Type: application/json`
- `x-vault-api-token: your-vault-api-token`

## Database Changes

Run these commands to register your Vault integration:

```sql
-- Insert your Vault API token (replace values)
INSERT INTO vault_integrations (agent_id, vault_api_token, is_active)
VALUES (1, 'your-vault-api-token-here', true);
```

## Testing

After deployment, test with:

```bash
curl -X POST https://leadpulse-saas-production.up.railway.app/api/vault-webhook \
  -H "Content-Type: application/json" \
  -H "x-vault-api-token: your-vault-api-token" \
  -d '{
    "event": "lead.created",
    "data": {
      "id": "test-001",
      "firstName": "Test",
      "lastName": "Lead",
      "email": "test@example.com",
      "phone": "+61 400 000 000",
      "propertyAddress": "123 Test St",
      "propertyType": "house",
      "buyingOrSelling": "buying",
      "budget": "$500k-$750k",
      "timeline": "ASAP",
      "source": "rea"
    }
  }'
```

Expected response: `201 Created` with `leadId` in response body.

## Next Steps

1. Deploy to Railway
2. Add Vault API token to database
3. Configure webhook in Vault CRM
4. Test with real leads from REA Group or Domain
5. Monitor dashboard for incoming leads

## Support

For issues:
- Check Railway logs: `railway logs`
- Review webhook logs in Vault CRM
- Verify API token is correct
- Ensure agent_id exists in database
