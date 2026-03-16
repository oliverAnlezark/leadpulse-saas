import express from 'express';
import { query } from '../db.js';
import { triggerAIResponse } from '../services/ai.js';

const router = express.Router();

// Webhook to receive leads from website forms
router.post('/leads/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { firstName, lastName, email, phone, propertyInterest, budget, timeline, leadSource } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields: firstName, lastName, email' });
    }

    // Verify agent exists
    const agentResult = await query('SELECT id FROM agents WHERE id = $1', [agentId]);
    if (agentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Create lead
    const leadResult = await query(
      `INSERT INTO leads (agent_id, first_name, last_name, email, phone, property_interest, budget_min, budget_max, timeline, lead_source, lead_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, first_name, last_name, email, phone, property_interest`,
      [agentId, firstName, lastName, email, phone, propertyInterest, budget?.min, budget?.max, timeline, leadSource || 'website_form', 'new']
    );

    const lead = leadResult.rows[0];

    // Trigger AI response asynchronously
    setImmediate(() => {
      triggerAIResponse(agentId, lead.id, lead.email, lead.first_name, lead.last_name, propertyInterest).catch(err => {
        console.error('AI response error:', err);
      });
    });

    res.status(201).json({
      success: true,
      leadId: lead.id,
      message: 'Lead received and AI response triggered'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to process lead' });
  }
});

export default router;
