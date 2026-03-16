import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter (using SendGrid or fallback to SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY || process.env.SMTP_PASSWORD
  }
});

export const sendEmail = async (to, subject, html, from = process.env.FROM_EMAIL || 'noreply@leadpulse.com.au') => {
  try {
    const mailOptions = {
      from,
      to,
      subject,
      html,
      text: html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

export const sendBulkEmails = async (recipients, subject, html) => {
  try {
    const results = [];

    for (const recipient of recipients) {
      try {
        const info = await sendEmail(recipient, subject, html);
        results.push({ recipient, success: true, messageId: info.messageId });
      } catch (error) {
        results.push({ recipient, success: false, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('Bulk email error:', error);
    throw error;
  }
};

export const sendFollowUpEmail = async (leadEmail, agentName, companyName, followUpMessage) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hello,</h2>
      <p>${followUpMessage}</p>
      <p>Best regards,<br>${agentName}<br>${companyName}</p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">
      <p style="font-size: 12px; color: #666;">This is an automated message from LeadPulse</p>
    </div>
  `;

  return sendEmail(leadEmail, `Follow-up from ${companyName}`, html);
};
