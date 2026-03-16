import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './auth.js';
import { query } from './db.js';

// Import routes
import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
import webhookRoutes from './routes/webhook.js';
import sequencesRoutes from './routes/sequences.js';
import crmRoutes from './routes/crm.js';
import analyticsRoutes from './routes/analytics.js';
import billingRoutes from './routes/billing.js';
import qualificationRoutes from './routes/qualification.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/webhook', webhookRoutes);

// Protected routes
app.use('/api/leads', authMiddleware, leadsRoutes);
app.use('/api/sequences', authMiddleware, sequencesRoutes);
app.use('/api/crm', authMiddleware, crmRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/qualification', authMiddleware, qualificationRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`LeadPulse server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
