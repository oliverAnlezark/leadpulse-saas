import express from 'express';
import { query } from '../db.js';
import { hashPassword, comparePassword, generateToken, authMiddleware, generateWebhookToken } from '../auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, companyName, phone } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if agent already exists
    const existingAgent = await query('SELECT id FROM agents WHERE email = $1', [email]);
    if (existingAgent.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const webhookToken = generateWebhookToken();

    // Create agent
    const result = await query(
      `INSERT INTO agents (email, password_hash, full_name, company_name, phone, webhook_token)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, company_name`,
      [email, passwordHash, fullName, companyName, phone, webhookToken]
    );

    const agent = result.rows[0];
    const token = generateToken(agent.id);

    res.status(201).json({
      agent: {
        id: agent.id,
        email: agent.email,
        fullName: agent.full_name,
        companyName: agent.company_name,
        webhookUrl: `${process.env.API_URL || 'http://localhost:5000'}/api/webhook/leads/${agent.id}`
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await query('SELECT id, password_hash, full_name, company_name FROM agents WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const agent = result.rows[0];
    const passwordMatch = await comparePassword(password, agent.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(agent.id);

    res.json({
      agent: {
        id: agent.id,
        email,
        fullName: agent.full_name,
        companyName: agent.company_name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, full_name, company_name, phone, timezone, subscription_status, subscription_end_date
       FROM agents WHERE id = $1`,
      [req.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = result.rows[0];
    res.json({
      id: agent.id,
      email: agent.email,
      fullName: agent.full_name,
      companyName: agent.company_name,
      phone: agent.phone,
      timezone: agent.timezone,
      subscriptionStatus: agent.subscription_status,
      subscriptionEndDate: agent.subscription_end_date
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, companyName, phone, timezone, aiPromptTemplate } = req.body;

    const result = await query(
      `UPDATE agents SET full_name = $1, company_name = $2, phone = $3, timezone = $4, ai_prompt_template = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING id, email, full_name, company_name, phone, timezone`,
      [fullName, companyName, phone, timezone, aiPromptTemplate, req.agentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = result.rows[0];
    res.json({
      id: agent.id,
      email: agent.email,
      fullName: agent.full_name,
      companyName: agent.company_name,
      phone: agent.phone,
      timezone: agent.timezone
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
