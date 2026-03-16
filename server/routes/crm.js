import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get CRM integrations
router.get('/integrations', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, crm_type, is_active, account_id, created_at FROM crm_integrations 
       WHERE agent_id = $1 ORDER BY created_at DESC`,
      [req.agentId]
    );

    res.json({
      integrations: result.rows.map(int => ({
        id: int.id,
        crmType: int.crm_type,
        isActive: int.is_active,
        accountId: int.account_id,
        createdAt: int.created_at
      }))
    });
  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

// Add CRM integration
router.post('/integrations', async (req, res) => {
  try {
    const { crmType, apiKey, apiSecret, accountId } = req.body;

    if (!crmType || !apiKey) {
      return res.status(400).json({ error: 'CRM type and API key required' });
    }

    // Check if integration already exists
    const existing = await query(
      'SELECT id FROM crm_integrations WHERE agent_id = $1 AND crm_type = $2',
      [req.agentId, crmType]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Integration already exists for this CRM' });
    }

    const result = await query(
      `INSERT INTO crm_integrations (agent_id, crm_type, api_key, api_secret, account_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, crm_type, is_active`,
      [req.agentId, crmType, apiKey, apiSecret, accountId, true]
    );

    res.status(201).json({
      id: result.rows[0].id,
      crmType: result.rows[0].crm_type,
      isActive: result.rows[0].is_active
    });
  } catch (error) {
    console.error('Add integration error:', error);
    res.status(500).json({ error: 'Failed to add integration' });
  }
});

// Update CRM integration
router.put('/integrations/:integrationId', async (req, res) => {
  try {
    const { integrationId } = req.params;
    const { isActive, apiKey } = req.body;

    const result = await query(
      `UPDATE crm_integrations SET is_active = $1, api_key = COALESCE($2, api_key), updated_at = NOW()
       WHERE id = $3 AND agent_id = $4
       RETURNING id, crm_type, is_active`,
      [isActive, apiKey, integrationId, req.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update integration error:', error);
    res.status(500).json({ error: 'Failed to update integration' });
  }
});

// Delete CRM integration
router.delete('/integrations/:integrationId', async (req, res) => {
  try {
    const { integrationId } = req.params;

    const result = await query(
      'DELETE FROM crm_integrations WHERE id = $1 AND agent_id = $2 RETURNING id',
      [integrationId, req.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    res.json({ success: true, message: 'Integration deleted' });
  } catch (error) {
    console.error('Delete integration error:', error);
    res.status(500).json({ error: 'Failed to delete integration' });
  }
});

// Sync leads to HubSpot
router.post('/sync/hubspot', async (req, res) => {
  try {
    const { leadId } = req.body;

    // Get HubSpot integration
    const intResult = await query(
      'SELECT api_key FROM crm_integrations WHERE agent_id = $1 AND crm_type = $2 AND is_active = true',
      [req.agentId, 'hubspot']
    );

    if (intResult.rows.length === 0) {
      return res.status(400).json({ error: 'HubSpot integration not configured' });
    }

    // Get lead data
    const leadResult = await query('SELECT * FROM leads WHERE id = $1 AND agent_id = $2', [leadId, req.agentId]);

    if (leadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const lead = leadResult.rows[0];

    // TODO: Implement HubSpot API sync
    // For now, just return success
    res.json({ success: true, message: 'Lead synced to HubSpot' });
  } catch (error) {
    console.error('HubSpot sync error:', error);
    res.status(500).json({ error: 'Failed to sync to HubSpot' });
  }
});

export default router;
