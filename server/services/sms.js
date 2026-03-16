import twilio from 'twilio';
import { query } from '../db.js';

export const sendSMS = async (agentId, toPhone, message) => {
  try {
    // Get agent's Twilio credentials
    const result = await query(
      'SELECT twilio_account_sid, twilio_auth_token, twilio_phone_number FROM communication_credentials WHERE agent_id = $1',
      [agentId]
    );

    if (result.rows.length === 0) {
      throw new Error('Twilio credentials not configured for agent');
    }

    const creds = result.rows[0];

    if (!creds.twilio_account_sid || !creds.twilio_auth_token) {
      throw new Error('Twilio credentials incomplete');
    }

    const client = twilio(creds.twilio_account_sid, creds.twilio_auth_token);

    const smsMessage = await client.messages.create({
      body: message,
      from: creds.twilio_phone_number,
      to: toPhone
    });

    console.log('SMS sent:', smsMessage.sid);
    return smsMessage;
  } catch (error) {
    console.error('SMS send error:', error);
    throw error;
  }
};

export const sendBulkSMS = async (agentId, recipients, message) => {
  try {
    const results = [];

    for (const recipient of recipients) {
      try {
        const result = await sendSMS(agentId, recipient, message);
        results.push({ recipient, success: true, messageId: result.sid });
      } catch (error) {
        results.push({ recipient, success: false, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('Bulk SMS error:', error);
    throw error;
  }
};

export const updateTwilioCredentials = async (agentId, accountSid, authToken, phoneNumber) => {
  try {
    // Check if credentials exist
    const existing = await query(
      'SELECT id FROM communication_credentials WHERE agent_id = $1',
      [agentId]
    );

    if (existing.rows.length > 0) {
      // Update
      await query(
        `UPDATE communication_credentials 
         SET twilio_account_sid = $1, twilio_auth_token = $2, twilio_phone_number = $3, updated_at = NOW()
         WHERE agent_id = $4`,
        [accountSid, authToken, phoneNumber, agentId]
      );
    } else {
      // Insert
      await query(
        `INSERT INTO communication_credentials (agent_id, twilio_account_sid, twilio_auth_token, twilio_phone_number)
         VALUES ($1, $2, $3, $4)`,
        [agentId, accountSid, authToken, phoneNumber]
      );
    }

    return true;
  } catch (error) {
    console.error('Update Twilio credentials error:', error);
    throw error;
  }
};
