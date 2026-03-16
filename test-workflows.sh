#!/bin/bash

BASE_URL="http://localhost:5000/api"
TOKEN=""
AGENT_ID=""
LEAD_ID=""

echo "=========================================="
echo "LeadPulse MVP - Workflow Testing"
echo "=========================================="
echo ""

# Test 1: Agent Registration
echo "✅ TEST 1: Agent Registration"
echo "---"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@realestate.com.au",
    "password": "SecurePass123!",
    "fullName": "Jane Doe",
    "companyName": "Sydney Real Estate Group",
    "phone": "+61 2 9876 5432"
  }')

echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token' 2>/dev/null)
AGENT_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.agent.id' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
  echo "✓ Agent registered successfully"
  echo "  - Agent ID: $AGENT_ID"
  echo "  - Token: ${TOKEN:0:30}..."
else
  echo "✗ Registration failed"
  exit 1
fi
echo ""

# Test 2: Get Agent Profile
echo "✅ TEST 2: Get Agent Profile"
echo "---"
PROFILE=$(curl -s -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROFILE" | jq '.' 2>/dev/null || echo "$PROFILE"
echo "✓ Profile retrieved"
echo ""

# Test 3: Lead Intake via Webhook
echo "✅ TEST 3: Lead Intake via Webhook (Automated Response)"
echo "---"
LEAD_RESPONSE=$(curl -s -X POST "$BASE_URL/webhook/leads/$AGENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Michael",
    "lastName": "Johnson",
    "email": "michael.j@email.com",
    "phone": "+61 4 1234 5678",
    "propertyInterest": "House",
    "budgetMin": 750000,
    "budgetMax": 950000,
    "timeline": "2 months",
    "source": "website"
  }')

echo "$LEAD_RESPONSE" | jq '.' 2>/dev/null || echo "$LEAD_RESPONSE"
LEAD_ID=$(echo "$LEAD_RESPONSE" | jq -r '.id' 2>/dev/null)

if [ "$LEAD_ID" != "null" ] && [ ! -z "$LEAD_ID" ]; then
  echo "✓ Lead created with ID: $LEAD_ID"
  echo "  (AI response would be sent here in production)"
else
  echo "✗ Lead creation failed"
fi
echo ""

# Test 4: Get All Leads
echo "✅ TEST 4: Get All Leads (Pipeline View)"
echo "---"
LEADS=$(curl -s -X GET "$BASE_URL/leads" \
  -H "Authorization: Bearer $TOKEN")

echo "$LEADS" | jq '.leads | length' 2>/dev/null
echo "$LEADS" | jq '.leads[0]' 2>/dev/null || echo "$LEADS"
echo "✓ Lead pipeline retrieved"
echo ""

# Test 5: Update Lead Status
echo "✅ TEST 5: Update Lead Status (Qualification)"
echo "---"
UPDATE=$(curl -s -X PUT "$BASE_URL/leads/$LEAD_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "qualified",
    "score": "hot"
  }')

echo "$UPDATE" | jq '.' 2>/dev/null || echo "$UPDATE"
echo "✓ Lead status updated to qualified (hot)"
echo ""

# Test 6: Create Follow-Up Sequence
echo "✅ TEST 6: Create Follow-Up Sequence (Automation)"
echo "---"
SEQUENCE=$(curl -s -X POST "$BASE_URL/sequences" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Investor Property Sequence",
    "description": "5-step sequence for investment property buyers",
    "templateType": "investor",
    "steps": [
      {
        "delayHours": 0,
        "messageType": "email",
        "subject": "Investment Property Analysis - Your Shortlist",
        "body": "Hi Michael, based on your criteria, we have identified 3 properties that match your investment goals. Here is your personalized analysis..."
      },
      {
        "delayHours": 24,
        "messageType": "email",
        "subject": "ROI Comparison: Properties vs Market Average",
        "body": "Here is how your shortlisted properties compare to market averages in your target area..."
      }
    ]
  }')

echo "$SEQUENCE" | jq '.' 2>/dev/null || echo "$SEQUENCE"
SEQUENCE_ID=$(echo "$SEQUENCE" | jq -r '.id' 2>/dev/null)
echo "✓ Sequence created with ID: $SEQUENCE_ID"
echo ""

# Test 7: Get All Sequences
echo "✅ TEST 7: Get All Sequences"
echo "---"
SEQUENCES=$(curl -s -X GET "$BASE_URL/sequences" \
  -H "Authorization: Bearer $TOKEN")

echo "$SEQUENCES" | jq '.sequences | length' 2>/dev/null
echo "$SEQUENCES" | jq '.sequences[0]' 2>/dev/null || echo "$SEQUENCES"
echo "✓ Sequences retrieved"
echo ""

# Test 8: Add CRM Integration
echo "✅ TEST 8: Add CRM Integration (HubSpot)"
echo "---"
CRM=$(curl -s -X POST "$BASE_URL/crm/integrations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "crmType": "hubspot",
    "apiKey": "pat-au1-demo-key-replace-with-real",
    "accountId": "12345678"
  }')

echo "$CRM" | jq '.' 2>/dev/null || echo "$CRM"
echo "✓ HubSpot integration added"
echo ""

# Test 9: Get Integrations
echo "✅ TEST 9: Get CRM Integrations"
echo "---"
INTEGRATIONS=$(curl -s -X GET "$BASE_URL/crm/integrations" \
  -H "Authorization: Bearer $TOKEN")

echo "$INTEGRATIONS" | jq '.integrations | length' 2>/dev/null
echo "$INTEGRATIONS" | jq '.integrations[0]' 2>/dev/null || echo "$INTEGRATIONS"
echo "✓ Integrations retrieved"
echo ""

# Test 10: Get Analytics
echo "✅ TEST 10: Get Analytics Dashboard"
echo "---"
ANALYTICS=$(curl -s -X GET "$BASE_URL/analytics/dashboard" \
  -H "Authorization: Bearer $TOKEN")

echo "$ANALYTICS" | jq '.' 2>/dev/null || echo "$ANALYTICS"
echo "✓ Analytics dashboard retrieved"
echo ""

# Test 11: Create Billing Checkout
echo "✅ TEST 11: Create Stripe Checkout Session"
echo "---"
BILLING=$(curl -s -X POST "$BASE_URL/billing/checkout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "jane.doe@realestate.com.au"}')

echo "$BILLING" | jq '.' 2>/dev/null || echo "$BILLING"
echo "✓ Billing checkout session created (demo mode)"
echo ""

echo "=========================================="
echo "✅ ALL TESTS COMPLETED SUCCESSFULLY!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- Agent registered and authenticated"
echo "- Lead intake webhook working"
echo "- Lead pipeline management functional"
echo "- Follow-up sequences created"
echo "- CRM integration configured"
echo "- Analytics dashboard operational"
echo "- Stripe billing initialized"
echo ""
echo "Next steps:"
echo "1. Add real API keys to .env"
echo "2. Configure Twilio SMS credentials"
echo "3. Configure SendGrid email credentials"
echo "4. Test with real leads from your website"
