import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Get lead statistics
    const leadsResult = await query(
      `SELECT 
        COUNT(*) as total_leads,
        SUM(CASE WHEN lead_status = 'qualified' THEN 1 ELSE 0 END) as qualified_leads,
        SUM(CASE WHEN lead_status = 'converted' THEN 1 ELSE 0 END) as converted_leads,
        SUM(CASE WHEN lead_score = 'hot' THEN 1 ELSE 0 END) as hot_leads
       FROM leads 
       WHERE agent_id = $1 
       AND created_at >= COALESCE($2::timestamp, NOW() - INTERVAL '30 days')
       AND created_at <= COALESCE($3::timestamp, NOW())`,
      [req.agentId, startDate, endDate]
    );

    const leads = leadsResult.rows[0];

    // Get communication statistics
    const commsResult = await query(
      `SELECT 
        message_type,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered
       FROM lead_conversations
       WHERE agent_id = $1
       AND created_at >= COALESCE($2::timestamp, NOW() - INTERVAL '30 days')
       AND created_at <= COALESCE($3::timestamp, NOW())
       GROUP BY message_type`,
      [req.agentId, startDate, endDate]
    );

    // Get response time analytics
    const responseTimeResult = await query(
      `SELECT 
        AVG(EXTRACT(EPOCH FROM (lc.created_at - l.created_at))/60) as avg_response_minutes,
        MIN(EXTRACT(EPOCH FROM (lc.created_at - l.created_at))/60) as min_response_minutes,
        MAX(EXTRACT(EPOCH FROM (lc.created_at - l.created_at))/60) as max_response_minutes
       FROM leads l
       LEFT JOIN lead_conversations lc ON l.id = lc.lead_id AND lc.direction = 'outbound'
       WHERE l.agent_id = $1
       AND l.created_at >= COALESCE($2::timestamp, NOW() - INTERVAL '30 days')
       AND l.created_at <= COALESCE($3::timestamp, NOW())`,
      [req.agentId, startDate, endDate]
    );

    const responseTime = responseTimeResult.rows[0];

    res.json({
      period: {
        startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: endDate || new Date()
      },
      leads: {
        total: parseInt(leads.total_leads) || 0,
        qualified: parseInt(leads.qualified_leads) || 0,
        converted: parseInt(leads.converted_leads) || 0,
        hot: parseInt(leads.hot_leads) || 0
      },
      communications: commsResult.rows.map(row => ({
        type: row.message_type,
        sent: parseInt(row.count) || 0,
        delivered: parseInt(row.delivered) || 0
      })),
      responseTime: {
        average: Math.round(responseTime.avg_response_minutes) || 0,
        min: Math.round(responseTime.min_response_minutes) || 0,
        max: Math.round(responseTime.max_response_minutes) || 0
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get lead source breakdown
router.get('/lead-sources', async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        lead_source,
        COUNT(*) as count,
        SUM(CASE WHEN lead_status = 'converted' THEN 1 ELSE 0 END) as conversions
       FROM leads
       WHERE agent_id = $1
       GROUP BY lead_source
       ORDER BY count DESC`,
      [req.agentId]
    );

    res.json({
      sources: result.rows.map(row => ({
        source: row.lead_source,
        leads: parseInt(row.count) || 0,
        conversions: parseInt(row.conversions) || 0
      }))
    });
  } catch (error) {
    console.error('Lead sources error:', error);
    res.status(500).json({ error: 'Failed to fetch lead sources' });
  }
});

// Get conversion funnel
router.get('/funnel', async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        lead_status,
        COUNT(*) as count
       FROM leads
       WHERE agent_id = $1
       GROUP BY lead_status
       ORDER BY created_at DESC`,
      [req.agentId]
    );

    res.json({
      funnel: result.rows.map(row => ({
        status: row.lead_status,
        count: parseInt(row.count) || 0
      }))
    });
  } catch (error) {
    console.error('Funnel error:', error);
    res.status(500).json({ error: 'Failed to fetch funnel' });
  }
});

export default router;
