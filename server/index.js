import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { authMiddleware } from './auth.js';
import { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
import webhookRoutes from './routes/webhook.js';
import sequencesRoutes from './routes/sequences.js';
import crmRoutes from './routes/crm.js';
import analyticsRoutes from './routes/analytics.js';
import billingRoutes from './routes/billing.js';
import qualificationRoutes from './routes/qualification.js';

// Suppress dotenv warnings
process.env.DOTENV_CONFIG_SILENT = 'true';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Auto-run migrations on startup
async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not set, skipping migrations');
    return;
  }

  try {
    const { Pool } = pg;
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    const client = await pool.connect();
    console.log('🔄 Running database migrations...');

    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes('already exists')) {
          console.error('Migration error:', error.message);
        }
      }
    }

    console.log('✓ Database migrations completed');
    await client.end();
    await pool.end();
  } catch (error) {
    console.error('Failed to run migrations:', error.message);
    // Don't exit, let the server start anyway
  }
}

// Run migrations before starting server
// Run migrations before starting server
(async () => {
  await runMigrations();
})();

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
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});

