import express from 'express';
import Stripe from 'stripe';
import { authMiddleware } from '../auth.js';
import { createCheckoutSession, handleCheckoutSessionCompleted, handleInvoicePaid, handleSubscriptionDeleted, getSubscriptionStatus, cancelSubscription } from '../services/stripe.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { agentId } = req;
    const { email } = req.body;

    const session = await createCheckoutSession(agentId, email);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get subscription status
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const status = await getSubscriptionStatus(req.agentId);
    res.json(status);
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Cancel subscription
router.post('/subscription/cancel', authMiddleware, async (req, res) => {
  try {
    await cancelSubscription(req.agentId);
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: error.message || 'Failed to cancel subscription' });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaid(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

export default router;
