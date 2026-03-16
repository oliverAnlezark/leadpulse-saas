import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get all sequences for agent
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM follow_up_sequences WHERE agent_id = $1 ORDER BY created_at DESC',
      [req.agentId]
    );

    res.json({
      sequences: result.rows.map(seq => ({
        id: seq.id,
        name: seq.name,
        description: seq.description,
        templateType: seq.template_type,
        isActive: seq.is_active,
        createdAt: seq.created_at
      }))
    });
  } catch (error) {
    console.error('Get sequences error:', error);
    res.status(500).json({ error: 'Failed to fetch sequences' });
  }
});

// Create sequence
router.post('/', async (req, res) => {
  try {
    const { name, description, templateType, steps } = req.body;

    if (!name || !steps || steps.length === 0) {
      return res.status(400).json({ error: 'Name and steps required' });
    }

    // Create sequence
    const seqResult = await query(
      `INSERT INTO follow_up_sequences (agent_id, name, description, template_type, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [req.agentId, name, description, templateType, true]
    );

    const sequenceId = seqResult.rows[0].id;

    // Create steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await query(
        `INSERT INTO follow_up_steps (sequence_id, step_number, delay_hours, message_type, subject, body)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [sequenceId, i + 1, step.delayHours, step.messageType, step.subject, step.body]
      );
    }

    res.status(201).json({
      id: sequenceId,
      name,
      description,
      templateType,
      stepsCount: steps.length
    });
  } catch (error) {
    console.error('Create sequence error:', error);
    res.status(500).json({ error: 'Failed to create sequence' });
  }
});

// Get sequence with steps
router.get('/:sequenceId', async (req, res) => {
  try {
    const { sequenceId } = req.params;

    const seqResult = await query(
      'SELECT * FROM follow_up_sequences WHERE id = $1 AND agent_id = $2',
      [sequenceId, req.agentId]
    );

    if (seqResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sequence not found' });
    }

    const sequence = seqResult.rows[0];

    const stepsResult = await query(
      'SELECT * FROM follow_up_steps WHERE sequence_id = $1 ORDER BY step_number ASC',
      [sequenceId]
    );

    res.json({
      id: sequence.id,
      name: sequence.name,
      description: sequence.description,
      templateType: sequence.template_type,
      isActive: sequence.is_active,
      steps: stepsResult.rows.map(step => ({
        id: step.id,
        stepNumber: step.step_number,
        delayHours: step.delay_hours,
        messageType: step.message_type,
        subject: step.subject,
        body: step.body
      }))
    });
  } catch (error) {
    console.error('Get sequence error:', error);
    res.status(500).json({ error: 'Failed to fetch sequence' });
  }
});

// Update sequence
router.put('/:sequenceId', async (req, res) => {
  try {
    const { sequenceId } = req.params;
    const { name, description, isActive } = req.body;

    const result = await query(
      `UPDATE follow_up_sequences SET name = $1, description = $2, is_active = $3, updated_at = NOW()
       WHERE id = $4 AND agent_id = $5
       RETURNING id, name, description, is_active`,
      [name, description, isActive, sequenceId, req.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sequence not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update sequence error:', error);
    res.status(500).json({ error: 'Failed to update sequence' });
  }
});

// Delete sequence
router.delete('/:sequenceId', async (req, res) => {
  try {
    const { sequenceId } = req.params;

    const result = await query(
      'DELETE FROM follow_up_sequences WHERE id = $1 AND agent_id = $2 RETURNING id',
      [sequenceId, req.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sequence not found' });
    }

    res.json({ success: true, message: 'Sequence deleted' });
  } catch (error) {
    console.error('Delete sequence error:', error);
    res.status(500).json({ error: 'Failed to delete sequence' });
  }
});

export default router;
