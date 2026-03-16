import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Check, AlertCircle } from 'lucide-react';

export default function BillingPage() {
  const { agent } = useAuthStore();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await axios.get('/api/billing/subscription', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscription(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setCheckoutLoading(true);
    try {
      const response = await axios.post(
        '/api/billing/checkout',
        { email: agent?.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await axios.post(
          '/api/billing/subscription/cancel',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchSubscription();
        alert('Subscription cancelled');
      } catch (error) {
        console.error('Cancel error:', error);
        alert('Failed to cancel subscription');
      }
    }
  };

  const features = [
    'Unlimited leads',
    'AI-powered responses',
    'Follow-up automation',
    'Email & SMS integration',
    'CRM integrations',
    'Analytics dashboard',
    'Lead qualification',
    'Priority support'
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your LeadPulse subscription</p>
      </div>

      {/* Current Subscription Status */}
      {loading ? (
        <div className="text-center text-gray-600">Loading subscription...</div>
      ) : subscription ? (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Current Plan</h2>
              <p className="text-gray-600 mt-2">LeadPulse Monthly - $100 AUD/month</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  Status: <span className="font-semibold capitalize text-green-600">{subscription.status}</span>
                </p>
                {subscription.endDate && (
                  <p className="text-sm text-gray-600">
                    Renews: <span className="font-semibold">{new Date(subscription.endDate).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleCancelSubscription}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900">No Active Subscription</h3>
              <p className="text-blue-800 text-sm mt-1">
                Subscribe to LeadPulse to unlock all features and start automating your lead management.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <h2 className="text-3xl font-bold text-white">LeadPulse Pro</h2>
          <p className="text-blue-100 mt-2">Everything you need to automate your lead management</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-gray-900">$100</span>
              <span className="text-gray-600 ml-2">/month</span>
            </div>
            <p className="text-gray-600 mt-2">Billed monthly. Cancel anytime.</p>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Check className="text-green-600 flex-shrink-0" size={20} />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          {subscription?.status !== 'active' && (
            <button
              onClick={handleSubscribe}
              disabled={checkoutLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {checkoutLoading ? 'Processing...' : 'Subscribe Now'}
            </button>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit and debit cards through Stripe.'
            },
            {
              q: 'Is there a free trial?',
              a: 'Contact our sales team at sales@leadpulse.com.au to discuss trial options.'
            },
            {
              q: 'What if I need more features?',
              a: 'Contact our support team to discuss custom plans and enterprise features.'
            }
          ].map((faq, i) => (
            <div key={i}>
              <h4 className="font-semibold text-gray-900">{faq.q}</h4>
              <p className="text-gray-600 mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
