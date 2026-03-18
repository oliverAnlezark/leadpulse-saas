import express from 'express';
import { query } from '../db.js';

const router = express.Router();

/**
 * Vault CRM Webhook Handler
 * 
 * Receives webhook notifications from Vault CRM when:
 * - New leads arrive from REA Group or Domain
 * - Lead details are updated
 * 
 * Expected payload:
 * {
 *   event: "lead.created" | "lead.updated",
 *   data: {
 *     id: string,                    // Vault lead ID
 *     firstName: string,
 *     lastName: string,
 *     email: string,
 *     phone: string,
 *     propertyAddress: string,
 *     propertyType: string,
 *     buyingOrSelling: string,
 *     budget: string,
 *     timeline: string,
 *     source: string                 // "rea", "domain", etc.
 *   },
 *   timestamp: number,
 *   signature: string                // HMAC-SHA256 signature
 * }
 */

// POST /api/vault-webhook
router.post('/', async (req, res) => {
  try {
    const { event, data, signature } = req.body;
    const vaultApiToken = req.headers['x-vault-api-token'];

    // Validate required fields
    if (!vaultApiToken) {
      return res.status(401).json({ error: 'Missing Vault API token in header' });
    }

    if (!data?.id) {
      return res.status(400).json({ error: 'Missing lead ID in webhook payload' });
    }

    // Find the agent with this Vault API token
    let agentId;
    try {
      const result = await query(
        'SELECT agent_id FROM vault_integrations WHERE vault_api_token = $1 AND is_active = true',
        [vaultApiToken]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid or inactive Vault API token' });
      }

      agentId = result.rows[0].agent_id;
    } catch (dbError) {
      console.error('[Vault Webhook] Database error finding agent:', dbError);
      return res.status(500).json({ error: 'Database error' });
    }

    // Check if lead already exists (prevent duplicates)
    let existingLead;
    try {
      const result = await query(
        'SELECT id FROM leads WHERE agent_id = $1 AND vault_lead_id = $2',
        [agentId, data.id]
      );
      existingLead = result.rows[0];
    } catch (dbError) {
      console.error('[Vault Webhook] Database error checking for existing lead:', dbError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (event === 'lead.created') {
      if (existingLead) {
        // Lead already exists, skip
        return res.status(200).json({
          message: 'Lead already exists',
          leadId: existingLead.id,
          action: 'skipped'
        });
      }

      // Create new lead
      try {
        const result = await query(
          `INSERT INTO leads (
            agent_id, first_name, last_name, email, phone,
            property_interest, timeline, lead_source, lead_status,
            source_system, vault_lead_id, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
          RETURNING id`,
          [
            agentId,
            data.firstName || 'Unknown',
            data.lastName || 'Lead',
            data.email || null,
            data.phone || null,
            data.propertyAddress || null,
            data.timeline || null,
            data.source || 'vault',
            'new',
            'vault',
            data.id
          ]
        );

        const leadId = result.rows[0].id;
        console.log(`[Vault Webhook] Created lead ${leadId} from Vault ID ${data.id}`);

        return res.status(201).json({
          message: 'Lead created successfully',
          leadId,
          vaultLeadId: data.id,
          action: 'created'
        });
      } catch (dbError) {
        console.error('[Vault Webhook] Error creating lead:', dbError);
        return res.status(500).json({ error: 'Failed to create lead' });
      }
    } else if (event === 'lead.updated' && existingLead) {
      // Update existing lead
      try {
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        if (data.firstName) {
          updateFields.push(`first_name = $${paramCount++}`);
          updateValues.push(data.firstName);
        }
        if (data.lastName) {
          updateFields.push(`last_name = $${paramCount++}`);
          updateValues.push(data.lastName);
        }
        if (data.email) {
          updateFields.push(`email = $${paramCount++}`);
          updateValues.push(data.email);
        }
        if (data.phone) {
          updateFields.push(`phone = $${paramCount++}`);
          updateValues.push(data.phone);
        }
        if (data.propertyAddress) {
          updateFields.push(`property_interest = $${paramCount++}`);
          updateValues.push(data.propertyAddress);
        }
        if (data.timeline) {
          updateFields.push(`timeline = $${paramCount++}`);
          updateValues.push(data.timeline);
        }

        updateFields.push(`updated_at = NOW()`);

        if (updateFields.length > 1) {
          // Only update if there are fields to update
          updateValues.push(existingLead.id);
          await query(
            `UPDATE leads SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
            updateValues
          );

          console.log(`[Vault Webhook] Updated lead ${existingLead.id} from Vault ID ${data.id}`);
        }

        return res.status(200).json({
          message: 'Lead updated successfully',
          leadId: existingLead.id,
          vaultLeadId: data.id,
          action: 'updated'
        });
      } catch (dbError) {
        console.error('[Vault Webhook] Error updating lead:', dbError);
        return res.status(500).json({ error: 'Failed to update lead' });
      }
    } else if (event === 'lead.updated' && !existingLead) {
      // Lead update received but lead doesn't exist - create it
      try {
        const result = await query(
          `INSERT INTO leads (
            agent_id, first_name, last_name, email, phone,
            property_interest, timeline, lead_source, lead_status,
            source_system, vault_lead_id, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
          RETURNING id`,
          [
            agentId,
            data.firstName || 'Unknown',
            data.lastName || 'Lead',
            data.email || null,
            data.phone || null,
            data.propertyAddress || null,
            data.timeline || null,
            data.source || 'vault',
            'new',
            'vault',
            data.id
          ]
        );

        const leadId = result.rows[0].id;
        console.log(`[Vault Webhook] Created lead ${leadId} from Vault update event`);

        return res.status(201).json({
          message: 'Lead created from update event',
          leadId,
          vaultLeadId: data.id,
          action: 'created'
        });
      } catch (dbError) {
        console.error('[Vault Webhook] Error creating lead from update:', dbError);
        return res.status(500).json({ error: 'Failed to create lead' });
      }
    }

    return res.status(400).json({ error: 'Unknown event type' });
  } catch (error) {
    console.error('[Vault Webhook] Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

export default router;
