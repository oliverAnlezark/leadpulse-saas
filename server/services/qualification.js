import { OpenAI } from 'openai';
import { query } from '../db.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const qualifyLead = async (leadId, agentId, responses = {}) => {
  try {
    // Get lead data
    const leadResult = await query('SELECT * FROM leads WHERE id = $1 AND agent_id = $2', [leadId, agentId]);

    if (leadResult.rows.length === 0) {
      throw new Error('Lead not found');
    }

    const lead = leadResult.rows[0];

    // Prepare qualification prompt
    const prompt = `You are a real estate lead qualification expert. Based on the following lead information, provide a qualification assessment.

Lead Information:
- Name: ${lead.first_name} ${lead.last_name}
- Property Interest: ${lead.property_interest || 'Not specified'}
- Budget: $${lead.budget_min || '0'} - $${lead.budget_max || 'Not specified'}
- Timeline: ${lead.timeline || 'Not specified'}
- Lead Source: ${lead.lead_source}

Additional Responses:
${Object.entries(responses).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Please provide:
1. Lead Score (hot/warm/cold)
2. Qualification Status (qualified/not_qualified/needs_more_info)
3. Key insights (2-3 sentences)
4. Recommended next action

Format your response as JSON.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a real estate lead qualification expert. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    let qualification;

    try {
      qualification = JSON.parse(content);
    } catch {
      // Extract JSON from response if wrapped in markdown
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        qualification = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid qualification response');
      }
    }

    // Update lead with qualification data
    const status = qualification['Qualification Status']?.toLowerCase().replace(' ', '_') || 'needs_more_info';
    const score = qualification['Lead Score']?.toLowerCase() || 'warm';

    await query(
      `UPDATE leads SET lead_status = $1, lead_score = $2, updated_at = NOW() WHERE id = $3`,
      [status, score, leadId]
    );

    return {
      leadId,
      score,
      status,
      insights: qualification['Key insights'],
      nextAction: qualification['Recommended next action']
    };
  } catch (error) {
    console.error('Lead qualification error:', error);
    throw error;
  }
};

export const generateQualificationQuestions = async (propertyInterest) => {
  try {
    const prompt = `Generate 3-4 qualifying questions for a real estate lead interested in: ${propertyInterest || 'general real estate'}

Format as a JSON array of question objects with 'question' and 'type' (text/select/date) fields.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a real estate lead qualification expert. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    let questions;

    try {
      questions = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid questions response');
      }
    }

    return questions;
  } catch (error) {
    console.error('Generate questions error:', error);
    throw error;
  }
};

export const scoreLeadQuality = async (leadId) => {
  try {
    // Get lead with conversation history
    const leadResult = await query(
      `SELECT l.*, COUNT(lc.id) as message_count
       FROM leads l
       LEFT JOIN lead_conversations lc ON l.id = lc.lead_id
       WHERE l.id = $1
       GROUP BY l.id`,
      [leadId]
    );

    if (leadResult.rows.length === 0) {
      throw new Error('Lead not found');
    }

    const lead = leadResult.rows[0];

    // Calculate quality score based on multiple factors
    let qualityScore = 0;

    // Budget provided (25 points)
    if (lead.budget_min && lead.budget_max) {
      qualityScore += 25;
    }

    // Timeline provided (25 points)
    if (lead.timeline) {
      qualityScore += 25;
    }

    // Contact information complete (25 points)
    if (lead.email && lead.phone) {
      qualityScore += 25;
    }

    // Engagement (25 points)
    if (lead.message_count > 0) {
      qualityScore += Math.min(25, lead.message_count * 5);
    }

    // Determine score level
    let scoreLevel = 'cold';
    if (qualityScore >= 75) {
      scoreLevel = 'hot';
    } else if (qualityScore >= 50) {
      scoreLevel = 'warm';
    }

    // Update lead score
    await query(
      'UPDATE leads SET lead_score = $1, updated_at = NOW() WHERE id = $2',
      [scoreLevel, leadId]
    );

    return {
      leadId,
      qualityScore,
      scoreLevel
    };
  } catch (error) {
    console.error('Score lead quality error:', error);
    throw error;
  }
};
