import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get all leads for agent
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let sql = 'SELECT * FROM leads WHERE agent_id = $1';
    const params = [req.agentId];

    if (status) {
      sql += ` AND lead_status = $${params.length + 1}`;
      params.push(status);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    res.json({
      leads: result.rows.map(lead => ({
        id: lead.id,
        firstName: lead.first_name,
        lastName: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        propertyInterest: lead.property_interest,
        budget: { min: lead.budget_min, max: lead.budget_max },
        timeline: lead.timeline,
        leadSource: lead.lead_source,
        status: lead.lead_status,
        score: lead.lead_score,
        createdAt: lead.created_at,
        updatedAt: lead.updated_at
      }))
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Get single lead
router.get('/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;

    const result = await query(
      'SELECT * FROM leads WHERE id = $1 AND agent_id = $2',
      [leadId, req.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const lead = result.rows[0];

    // Get conversation history
    const conversations = await query(
      'SELECT * FROM lead_conversations WHERE lead_id = $1 ORDER BY created_at DESC',
      [leadId]
    );

    res.json({
      id: lead.id,
      firstName: lead.first_name,
      lastName: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      propertyInterest: lead.property_interest,
      budget: { min: lead.budget_min, max: lead.budget_max },
      timeline: lead.timeline,
      leadSource: lead.lead_source,
      status: lead.lead_status,
      score: lead.lead_score,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at,
      conversations: conversations.rows.map(conv => ({
        id: conv.id,
        type: conv.message_type,
        direction: conv.direction,
        content: conv.content,
        status: conv.status,
        createdAt: conv.created_at
      }))
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// Update lead status
router.put('/:leadId/status', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, score } = req.body;

    const result = await query(
      `UPDATE leads SET lead_status = $1, lead_score = $2, updated_at = NOW()
       WHERE id = $3 AND agent_id = $4
       RETURNING *`,
      [status, score, leadId, req.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const lead = result.rows[0];
    res.json({
      id: lead.id,
      status: lead.lead_status,
      score: lead.lead_score
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Delete lead
router.delete('/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;

    const result = await query(
      'DELETE FROM leads WHERE id = $1 AND agent_id = $2 RETURNING id',
      [leadId, req.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

export default router;
