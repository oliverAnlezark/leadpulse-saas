import { OpenAI } from 'openai';
import { query } from '../db.js';
import { sendEmail } from './email.js';
import { sendSMS } from './sms.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const triggerAIResponse = async (agentId, leadId, leadEmail, firstName, lastName, propertyInterest) => {
  try {
    // Get agent details
    const agentResult = await query(
      'SELECT ai_prompt_template, full_name, company_name FROM agents WHERE id = $1',
      [agentId]
    );

    if (agentResult.rows.length === 0) {
      console.error('Agent not found');
      return;
    }

    const agent = agentResult.rows[0];

    // Generate AI response
    const prompt = agent.ai_prompt_template || getDefaultPrompt();
    const systemPrompt = `You are a professional real estate agent assistant for ${agent.company_name || agent.full_name}. 
Generate a warm, professional response to a lead inquiry. Keep it concise (2-3 sentences) and include a call to action.
The lead is interested in: ${propertyInterest || 'real estate'}`;

    const userPrompt = `Lead name: ${firstName} ${lastName}
Lead email: ${leadEmail}
Lead inquiry: ${propertyInterest || 'General inquiry'}

${prompt}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const aiMessage = response.choices[0].message.content;

    // Store conversation
    await query(
      `INSERT INTO lead_conversations (lead_id, agent_id, message_type, direction, content, sender, recipient, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [leadId, agentId, 'email', 'outbound', aiMessage, agent.full_name, leadEmail, 'sent']
    );

    // Send email
    await sendEmail(leadEmail, `Response to your inquiry - ${agent.company_name || agent.full_name}`, aiMessage);

    // Update lead status
    await query(
      'UPDATE leads SET lead_status = $1, updated_at = NOW() WHERE id = $2',
      [leadId, 'contacted']
    );

    console.log(`AI response sent to lead ${leadId}`);
  } catch (error) {
    console.error('AI response error:', error);
  }
};

const getDefaultPrompt = () => {
  return `Please generate a professional, warm response to this lead inquiry. 
Include:
1. A warm greeting
2. Acknowledgment of their interest
3. A brief value proposition
4. A call to action (e.g., "Let's schedule a call")
Keep it concise and professional.`;
};

export const generateLeadQualificationQuestions = async (propertyInterest) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a real estate lead qualification expert. Generate 3-4 qualifying questions for a lead inquiry.'
        },
        {
          role: 'user',
          content: `Generate qualifying questions for a lead interested in: ${propertyInterest || 'real estate'}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Qualification questions error:', error);
    return null;
  }
};
