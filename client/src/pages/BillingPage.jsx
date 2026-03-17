import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, Zap, Shield, AlertCircle, Star } from 'lucide-react';

const FEATURES = [
  'Unlimited leads', 'AI-powered responses',
  'Follow-up automation', 'Email & SMS integration',
  'CRM integrations', 'Analytics dashboard',
  'Lead qualification', 'Priority support',
];

export default function BillingPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/billing/subscription', { headers: { Authorization: `Bearer ${token}` } });
        setSubscription(res.data);
      } catch { setSubscription(null); }
      finally { setLoading(false); }
    };
    if (token) fetch();
  }, [token]);

  const handleSubscribe = async () => {
    try {
      const res = await axios.post('/api/billing/create-checkout-session', {}, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) { console.error('Checkout error:', err); }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
    setCancelling(true);
    try {
      await axios.post('/api/billing/cancel-subscription', {}, { headers: { Authorization: `Bearer ${token}` } });
      window.location.reload();
    } catch (err) { console.error('Cancel error:', err); }
    finally { setCancelling(false); }
  };

  const isActive = subscription?.status === 'active';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', borderRadius: '16px', padding: '28px 36px', color: 'white', boxShadow: '0 8px 32px rgba(124,58,237,0.2)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0', color: 'white' }}>Billing & Subscription</h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>Manage your LeadPulse subscription and payment method</p>
      </div>

      {!loading && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: isActive ? '1px solid #a7f3d0' : '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', background: isActive ? '#d1fae5' : '#f3f4f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isActive ? <CheckCircle size={22} color="#10b981" /> : <AlertCircle size={22} color="#9ca3af" />}
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 3px 0' }}>{isActive ? 'Active Subscription' : 'No Active Subscription'}</p>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                {isActive ? `LeadPulse Monthly - $100 AUD/month - Status: ACTIVE` : 'Subscribe to unlock all LeadPulse features'}
              </p>
            </div>
          </div>
          {isActive && (
            <button onClick={handleCancel} disabled={cancelling} style={{ padding: '8px 18px', border: '1px solid #fca5a5', borderRadius: '8px', background: '#fff5f5', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              {cancelling ? 'Cancelling...' : 'Cancel Plan'}
            </button>
          )}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Star size={20} color="rgba(255,255,255,0.9)" />
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: 0 }}>LeadPulse Pro</h2>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>Everything you need to automate your lead management</p>
        </div>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '48px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>$100</span>
            <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: '500' }}>/month AUD</span>
          </div>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 28px 0' }}>Billed monthly. Cancel anytime. No long-term contracts.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>{f}</span>
              </div>
            ))}
          </div>
          {!isActive ? (
            <button onClick={handleSubscribe} style={{ width: '100%', padding: '14px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
              <CreditCard size={18} /> Subscribe Now - $100 AUD/month
            </button>
          ) : (
            <div style={{ background: '#d1fae5', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#10b981', margin: 0 }}>You are currently subscribed to LeadPulse Pro</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { icon: Shield, color: '#3b82f6', bg: '#dbeafe', label: 'Secure Payments', desc: 'All payments processed securely through Stripe' },
          { icon: CheckCircle, color: '#10b981', bg: '#d1fae5', label: 'Cancel Anytime', desc: 'No long-term contracts or hidden fees' },
          { icon: Zap, color: '#f59e0b', bg: '#fef3c7', label: 'Instant Access', desc: 'Start using LeadPulse immediately after subscribing' },
        ].map(({ icon: Icon, color, bg, label, desc }) => (
          <div key={label} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', background: bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>{label}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 20px 0' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards through Stripe.' },
            { q: 'Is there a free trial?', a: 'Contact us to discuss a trial period for your team.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>{q}</p>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
