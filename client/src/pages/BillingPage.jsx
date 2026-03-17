import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Check, AlertCircle, CreditCard, Zap, Shield } from 'lucide-react';

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
    { name: 'Unlimited leads', icon: '📊' },
    { name: 'AI-powered responses', icon: '🤖' },
    { name: 'Follow-up automation', icon: '⚡' },
    { name: 'Email & SMS integration', icon: '💬' },
    { name: 'CRM integrations', icon: '🔗' },
    { name: 'Analytics dashboard', icon: '📈' },
    { name: 'Lead qualification', icon: '✅' },
    { name: 'Priority support', icon: '🎯' }
  ];

  const faqs = [
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
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-2">Manage your LeadPulse subscription and payment method</p>
      </div>

      {/* Current Subscription Status */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading subscription...</p>
          </div>
        </div>
      ) : subscription ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                <Check className="text-green-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Active Subscription</h2>
                <p className="text-gray-600 mt-2 text-lg font-semibold">LeadPulse Monthly - $100 AUD/month</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-700">
                    Status: <span className="font-bold text-green-600">● {subscription.status.toUpperCase()}</span>
                  </p>
                  {subscription.endDate && (
                    <p className="text-sm text-gray-700">
                      Renews: <span className="font-semibold">{new Date(subscription.endDate).toLocaleDateString()}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleCancelSubscription}
              className="px-6 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold transition-all flex-shrink-0"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-8">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
              <AlertCircle className="text-blue-600" size={28} />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg">No Active Subscription</h3>
              <p className="text-blue-800 text-sm mt-2">
                Subscribe to LeadPulse to unlock all features and start automating your lead management.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <Zap className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-bold text-white">LeadPulse Pro</h2>
          </div>
          <p className="text-purple-100 text-lg">Everything you need to automate your lead management</p>
        </div>

        {/* Pricing Section */}
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-gray-900">$100</span>
              <span className="text-gray-600 text-lg">/month</span>
            </div>
            <p className="text-gray-600 mt-3">Billed monthly. Cancel anytime. No long-term contracts.</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                <span className="text-gray-700 font-medium">{feature.name}</span>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          {subscription?.status !== 'active' && (
            <button
              onClick={handleSubscribe}
              disabled={checkoutLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <CreditCard size={20} />
              <span>{checkoutLoading ? 'Processing...' : 'Subscribe Now'}</span>
            </button>
          )}

          {subscription?.status === 'active' && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-semibold">✓ You have an active subscription</p>
            </div>
          )}
        </div>
      </div>

      {/* Trust & Security */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
            <Shield className="text-blue-600" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Secure Payments</h3>
          <p className="text-gray-600 text-sm">All payments are processed securely through Stripe</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="bg-green-100 rounded-lg p-3 w-fit mb-4">
            <Check className="text-green-600" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Cancel Anytime</h3>
          <p className="text-gray-600 text-sm">No long-term contracts or hidden fees</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="bg-purple-100 rounded-lg p-3 w-fit mb-4">
            <Zap className="text-purple-600" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Instant Access</h3>
          <p className="text-gray-600 text-sm">Start using LeadPulse immediately after subscribing</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h3>
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
              <h4 className="font-bold text-gray-900 text-lg mb-3">{faq.q}</h4>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Need Help?</h3>
        <p className="text-gray-600 mb-6">
          Have questions about billing or need a custom plan? Contact our sales team.
        </p>
        <a
          href="mailto:sales@leadpulse.com.au"
          className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Contact Sales
        </a>
      </div>
    </div>
  );
}
