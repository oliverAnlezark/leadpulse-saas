-- LeadPulse Database Schema

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phone VARCHAR(20),
  timezone VARCHAR(50) DEFAULT 'Australia/Sydney',
  webhook_token VARCHAR(255) UNIQUE,
  ai_prompt_template TEXT,
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CRM Integrations table
CREATE TABLE IF NOT EXISTS crm_integrations (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  crm_type VARCHAR(50) NOT NULL,
  api_key VARCHAR(500) NOT NULL,
  api_secret VARCHAR(500),
  account_id VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agent_id, crm_type)
);

-- Communication Credentials table
CREATE TABLE IF NOT EXISTS communication_credentials (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  twilio_account_sid VARCHAR(500),
  twilio_auth_token VARCHAR(500),
  twilio_phone_number VARCHAR(20),
  sendgrid_api_key VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  property_interest VARCHAR(500),
  budget_min INTEGER,
  budget_max INTEGER,
  timeline VARCHAR(100),
  lead_source VARCHAR(100),
  lead_status VARCHAR(50) DEFAULT 'new',
  lead_score VARCHAR(20) DEFAULT 'warm',
  crm_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lead Conversations table
CREATE TABLE IF NOT EXISTS lead_conversations (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  message_type VARCHAR(50) NOT NULL,
  direction VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  sender VARCHAR(255),
  recipient VARCHAR(255),
  status VARCHAR(50) DEFAULT 'sent',
  external_message_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follow-Up Sequences table
CREATE TABLE IF NOT EXISTS follow_up_sequences (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follow-Up Steps table
CREATE TABLE IF NOT EXISTS follow_up_steps (
  id SERIAL PRIMARY KEY,
  sequence_id INTEGER NOT NULL REFERENCES follow_up_sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  delay_hours INTEGER NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lead Sequence Assignments table
CREATE TABLE IF NOT EXISTS lead_sequence_assignments (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  sequence_id INTEGER NOT NULL REFERENCES follow_up_sequences(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Lead Sequence Progress table
CREATE TABLE IF NOT EXISTS lead_sequence_progress (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  step_id INTEGER NOT NULL REFERENCES follow_up_steps(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  leads_received INTEGER DEFAULT 0,
  leads_responded_within_5min INTEGER DEFAULT 0,
  leads_qualified INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  sms_sent INTEGER DEFAULT 0,
  response_rate DECIMAL(5, 2),
  conversion_rate DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agent_id, metric_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
CREATE INDEX IF NOT EXISTS idx_agents_subscription_status ON agents(subscription_status);
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON lead_conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON lead_conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_sequences_agent_id ON follow_up_sequences(agent_id);
CREATE INDEX IF NOT EXISTS idx_assignments_lead_id ON lead_sequence_assignments(lead_id);
CREATE INDEX IF NOT EXISTS idx_progress_lead_id ON lead_sequence_progress(lead_id);
CREATE INDEX IF NOT EXISTS idx_analytics_agent_date ON analytics(agent_id, metric_date);
