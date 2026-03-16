import express from 'express';
import { authMiddleware } from '../auth.js';
import { qualifyLead, generateQualificationQuestions, scoreLeadQuality } from '../services/qualification.js';

const router = express.Router();

// Qualify a lead
router.post('/leads/:leadId/qualify', authMiddleware, async (req, res) => {
  try {
    const { leadId } = req.params;
    const { responses } = req.body;

    const result = await qualifyLead(leadId, req.agentId, responses);
    res.json(result);
  } catch (error) {
    console.error('Qualify lead error:', error);
    res.status(500).json({ error: error.message || 'Failed to qualify lead' });
  }
});

// Generate qualification questions
router.post('/questions', authMiddleware, async (req, res) => {
  try {
    const { propertyInterest } = req.body;

    const questions = await generateQualificationQuestions(propertyInterest);
    res.json({ questions });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Score lead quality
router.post('/leads/:leadId/score', authMiddleware, async (req, res) => {
  try {
    const { leadId } = req.params;

    const result = await scoreLeadQuality(leadId);
    res.json(result);
  } catch (error) {
    console.error('Score lead error:', error);
    res.status(500).json({ error: 'Failed to score lead' });
  }
});

export default router;
