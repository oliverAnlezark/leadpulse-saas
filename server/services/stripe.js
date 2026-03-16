import Stripe from 'stripe';
import { query } from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (agentId, agentEmail) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'LeadPulse Monthly Subscription',
              description: 'AI-powered lead automation for real estate agents'
            },
            unit_amount: 10000 // $100 AUD in cents
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings`,
      customer_email: agentEmail,
      metadata: {
        agentId
      }
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    throw error;
  }
};

export const handleCheckoutSessionCompleted = async (session) => {
  try {
    const agentId = session.metadata.agentId;

    // Get or create Stripe customer
    let customerId = session.customer;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.customer_email,
        metadata: { agentId }
      });
      customerId = customer.id;
    }

    // Update agent with Stripe customer ID and subscription status
    await query(
      `UPDATE agents SET stripe_customer_id = $1, subscription_status = $2, subscription_end_date = NOW() + INTERVAL '1 month', updated_at = NOW()
       WHERE id = $3`,
      [customerId, 'active', agentId]
    );

    console.log(`Subscription activated for agent ${agentId}`);
  } catch (error) {
    console.error('Handle checkout session error:', error);
    throw error;
  }
};

export const handleInvoicePaid = async (invoice) => {
  try {
    const customerId = invoice.customer;

    // Find agent by Stripe customer ID
    const result = await query(
      'SELECT id FROM agents WHERE stripe_customer_id = $1',
      [customerId]
    );

    if (result.rows.length > 0) {
      const agentId = result.rows[0].id;

      // Update subscription end date
      await query(
        `UPDATE agents SET subscription_end_date = NOW() + INTERVAL '1 month', updated_at = NOW()
         WHERE id = $1`,
        [agentId]
      );

      console.log(`Invoice paid for agent ${agentId}`);
    }
  } catch (error) {
    console.error('Handle invoice paid error:', error);
    throw error;
  }
};

export const handleSubscriptionDeleted = async (subscription) => {
  try {
    const customerId = subscription.customer;

    // Find agent by Stripe customer ID
    const result = await query(
      'SELECT id FROM agents WHERE stripe_customer_id = $1',
      [customerId]
    );

    if (result.rows.length > 0) {
      const agentId = result.rows[0].id;

      // Update subscription status
      await query(
        `UPDATE agents SET subscription_status = $1, updated_at = NOW()
         WHERE id = $2`,
        ['inactive', agentId]
      );

      console.log(`Subscription cancelled for agent ${agentId}`);
    }
  } catch (error) {
    console.error('Handle subscription deleted error:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (agentId) => {
  try {
    const result = await query(
      'SELECT stripe_customer_id, subscription_status, subscription_end_date FROM agents WHERE id = $1',
      [agentId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const agent = result.rows[0];
    return {
      customerId: agent.stripe_customer_id,
      status: agent.subscription_status,
      endDate: agent.subscription_end_date
    };
  } catch (error) {
    console.error('Get subscription status error:', error);
    throw error;
  }
};

export const cancelSubscription = async (agentId) => {
  try {
    const result = await query(
      'SELECT stripe_customer_id FROM agents WHERE id = $1',
      [agentId]
    );

    if (result.rows.length === 0) {
      throw new Error('Agent not found');
    }

    const customerId = result.rows[0].stripe_customer_id;

    if (!customerId) {
      throw new Error('No Stripe customer found');
    }

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active'
    });

    // Cancel all active subscriptions
    for (const subscription of subscriptions.data) {
      await stripe.subscriptions.del(subscription.id);
    }

    return true;
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw error;
  }
};
