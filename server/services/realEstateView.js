import axios from 'axios';
import { query } from '../db.js';

const REV_BASE_URL = 'https://api.realestateview.com.au/api/v1';

export const syncLeadToRealEstateView = async (agentId, leadId) => {
  try {
    // Get agent's Real Estate View integration
    const integResult = await query(
      'SELECT api_key, account_id FROM crm_integrations WHERE agent_id = $1 AND crm_type = $2 AND is_active = true',
      [agentId, 'real_estate_view']
    );

    if (integResult.rows.length === 0) {
      throw new Error('Real Estate View integration not configured');
    }

    const { api_key, account_id } = integResult.rows[0];

    // Get lead data
    const leadResult = await query('SELECT * FROM leads WHERE id = $1 AND agent_id = $2', [leadId, agentId]);

    if (leadResult.rows.length === 0) {
      throw new Error('Lead not found');
    }

    const lead = leadResult.rows[0];

    // Create contact in Real Estate View
    const contactData = {
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      property_interest: lead.property_interest,
      budget_min: lead.budget_min,
      budget_max: lead.budget_max,
      timeline: lead.timeline,
      source: lead.lead_source
    };

    const response = await axios.post(
      `${REV_BASE_URL}/contacts`,
      contactData,
      {
        headers: {
          'Authorization': `Bearer ${api_key}`,
          'X-Account-ID': account_id,
          'Content-Type': 'application/json'
        }
      }
    );

    // Store CRM ID for future syncs
    await query(
      'UPDATE leads SET crm_id = $1, updated_at = NOW() WHERE id = $2',
      [response.data.id, leadId]
    );

    return response.data;
  } catch (error) {
    console.error('Real Estate View sync error:', error);
    throw error;
  }
};

export const updateLeadInRealEstateView = async (agentId, leadId) => {
  try {
    // Get agent's Real Estate View integration
    const integResult = await query(
      'SELECT api_key, account_id FROM crm_integrations WHERE agent_id = $1 AND crm_type = $2 AND is_active = true',
      [agentId, 'real_estate_view']
    );

    if (integResult.rows.length === 0) {
      throw new Error('Real Estate View integration not configured');
    }

    const { api_key, account_id } = integResult.rows[0];

    // Get lead data
    const leadResult = await query('SELECT * FROM leads WHERE id = $1 AND agent_id = $2', [leadId, agentId]);

    if (leadResult.rows.length === 0) {
      throw new Error('Lead not found');
    }

    const lead = leadResult.rows[0];

    if (!lead.crm_id) {
      throw new Error('Lead not synced to Real Estate View');
    }

    // Update contact in Real Estate View
    const updateData = {
      status: lead.lead_status,
      score: lead.lead_score
    };

    await axios.put(
      `${REV_BASE_URL}/contacts/${lead.crm_id}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${api_key}`,
          'X-Account-ID': account_id,
          'Content-Type': 'application/json'
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Real Estate View update error:', error);
    throw error;
  }
};

export const getContactsFromRealEstateView = async (agentId) => {
  try {
    // Get agent's Real Estate View integration
    const integResult = await query(
      'SELECT api_key, account_id FROM crm_integrations WHERE agent_id = $1 AND crm_type = $2 AND is_active = true',
      [agentId, 'real_estate_view']
    );

    if (integResult.rows.length === 0) {
      throw new Error('Real Estate View integration not configured');
    }

    const { api_key, account_id } = integResult.rows[0];

    // Fetch contacts from Real Estate View
    const response = await axios.get(
      `${REV_BASE_URL}/contacts`,
      {
        headers: {
          'Authorization': `Bearer ${api_key}`,
          'X-Account-ID': account_id
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Real Estate View fetch error:', error);
    throw error;
  }
};
