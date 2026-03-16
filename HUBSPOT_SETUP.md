# HubSpot Private App Setup for LeadPulse

## Step-by-Step Guide to Create Private App

### Step 1: Navigate to Private Apps
1. Go to [HubSpot](https://app.hubspot.com)
2. Click your **account icon** (top right)
3. Select **Settings**
4. In left sidebar, go to **Integrations** → **Private apps**
5. Click **Create app**

### Step 2: Basic Info
1. **App name:** `LeadPulse`
2. **App description:** `AI-powered lead response and follow-up automation`
3. Click **Next**

### Step 3: Set Scopes (Required Permissions)
You need to grant these scopes for LeadPulse to work:

**Contacts:**
- ✅ `crm.objects.contacts.read` - Read contact data
- ✅ `crm.objects.contacts.write` - Create/update contacts

**Companies:**
- ✅ `crm.objects.companies.read` - Read company data
- ✅ `crm.objects.companies.write` - Create/update companies

**Deals:**
- ✅ `crm.objects.deals.read` - Read deal data
- ✅ `crm.objects.deals.write` - Create/update deals

**Activities:**
- ✅ `crm.objects.custom_objects.read` - Read custom objects
- ✅ `crm.objects.custom_objects.write` - Write custom objects

**Timeline/Activities:**
- ✅ `crm.objects.timelines.read` - Read timeline events

**Search:**
- ✅ `crm.lists.read` - Read lists

After selecting scopes, click **Next**

### Step 4: Set Webhooks (Optional but Recommended)
1. Click the **Webhooks** tab
2. Toggle **Webhooks** to ON
3. Add these webhook subscriptions:

**Event Subscriptions:**
- `contact.creation` - When a new contact is created
- `contact.propertyChange` - When contact properties change
- `deal.creation` - When a new deal is created
- `deal.propertyChange` - When deal properties change

**Webhook URL:**
```
https://your-domain.com/api/crm/webhooks/hubspot
```

*(Replace `your-domain.com` with your actual LeadPulse domain)*

4. Click **Create app**

### Step 5: Get Your Access Token
1. After app creation, you'll see the **Access token** section
2. Click **Show token** (or **Copy** if available)
3. Copy the full token (starts with `pat-`)
4. This is your **HubSpot API Key** for LeadPulse

### Example Token Format
```
pat-au1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## Minimal Setup (If You Don't Want Webhooks)

If you just want to sync leads without webhooks:

1. Follow Steps 1-3 above
2. Skip the Webhooks section
3. Click **Create app**
4. Copy the Access Token
5. Use it in LeadPulse `.env`:
```
HUBSPOT_API_KEY=pat-au1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## What Each Scope Does

| Scope | Purpose |
|-------|---------|
| `crm.objects.contacts.read` | LeadPulse reads existing contacts |
| `crm.objects.contacts.write` | LeadPulse creates/updates contacts from leads |
| `crm.objects.companies.read` | LeadPulse reads company data |
| `crm.objects.companies.write` | LeadPulse creates/updates companies |
| `crm.objects.deals.read` | LeadPulse reads deal pipeline |
| `crm.objects.deals.write` | LeadPulse creates/updates deals |
| `crm.objects.custom_objects.read` | LeadPulse reads custom fields |
| `crm.objects.custom_objects.write` | LeadPulse writes to custom fields |

---

## Webhook Events Explained

| Event | When It Fires | Use Case |
|-------|---------------|----------|
| `contact.creation` | New contact added to HubSpot | Sync new leads |
| `contact.propertyChange` | Contact properties updated | Track lead status changes |
| `deal.creation` | New deal created | Track conversions |
| `deal.propertyChange` | Deal properties updated | Track deal progress |

---

## Testing Your Setup

Once you have the token, test it:

```bash
curl -X GET https://api.hubapi.com/crm/v3/objects/contacts \
  -H "Authorization: Bearer pat-au1-your-token-here" \
  -H "Content-Type: application/json"
```

You should get a response with contact data (or empty list if no contacts yet).

---

## Troubleshooting

### "Invalid token" Error
- Make sure you copied the FULL token (including `pat-` prefix)
- Verify the token hasn't expired
- Regenerate the token if needed

### "Insufficient permissions" Error
- Go back to Private App settings
- Verify all required scopes are selected
- Regenerate the token after adding scopes

### Webhook Not Triggering
- Verify your domain is publicly accessible (HTTPS)
- Check that the webhook URL is correct
- Look at HubSpot's webhook logs for errors

---

## Next Steps

1. Create the Private App following the steps above
2. Copy the Access Token
3. Provide it to me so I can update LeadPulse configuration
4. Run the workflow tests to verify everything works

Questions? Contact HubSpot support: https://developers.hubspot.com
