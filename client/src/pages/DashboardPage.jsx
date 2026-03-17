import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, MessageSquare, Clock, Zap, Settings, ChevronRight, Copy, Check, Activity, Target } from 'lucide-react';

export default function DashboardPage() {
  const { agent } = useAuthStore();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAnalytics();
  }, [token]);

  const copyWebhook = () => {
    const webhookUrl = `${window.location.origin}/api/webhook/leads/${agent?.id}`;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metricCards = [
    {
      label: 'Total Leads',
      value: analytics?.leads?.total ?? 0,
      sub: `${analytics?.leads?.qualified ?? 0} qualified`,
      icon: Users,
      color: '#7c3aed',
      bg: '#f3e8ff',
    },
    {
      label: 'Converted',
      value: analytics?.leads?.converted ?? 0,
      sub: `${analytics?.leads?.hot ?? 0} hot leads`,
      icon: CheckCircle,
      color: '#10b981',
      bg: '#d1fae5',
    },
    {
      label: 'Messages Sent',
      value: analytics?.communications?.reduce((s, c) => s + c.sent, 0) ?? 0,
      sub: `${analytics?.communications?.reduce((s, c) => s + c.delivered, 0) ?? 0} delivered`,
      icon: MessageSquare,
      color: '#3b82f6',
      bg: '#dbeafe',
    },
    {
      label: 'Avg Response',
      value: `${analytics?.responseTime?.average ?? 0}m`,
      sub: `${analytics?.responseTime?.min ?? 0}m – ${analytics?.responseTime?.max ?? 0}m`,
      icon: Clock,
      color: '#f59e0b',
      bg: '#fef3c7',
    },
  ];

  const quickActions = [
    { label: 'View Leads', desc: 'Manage your lead pipeline', icon: Users, color: '#7c3aed', path: '/leads' },
    { label: 'Create Sequence', desc: 'Set up follow-up automation', icon: Zap, color: '#10b981', path: '/sequences' },
    { label: 'Configure CRM', desc: 'Connect your CRM integration', icon: Settings, color: '#3b82f6', path: '/settings' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        borderRadius: '16px',
        padding: '32px 36px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 6px 0', color: 'white' }}>
          Welcome back, {agent?.fullName?.split(' ')[0] || 'Agent'}! 👋
        </h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: '15px' }}>
          {agent?.companyName || 'Your Agency'} · {agent?.location || 'Australia'}
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                background: card.bg,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={22} color={card.color} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                <p style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: '0 0 3px 0', lineHeight: 1 }}>{card.value}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                style={{
                  background: 'white',
                  border: '1px solid #f3f4f6',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = action.color + '40';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#f3f4f6';
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  background: action.color + '15',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={20} color={action.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 2px 0' }}>{action.label}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{action.desc}</p>
                </div>
                <ChevronRight size={16} color="#d1d5db" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Webhook URL */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>
          Webhook URL for Lead Intake
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 14px 0' }}>
          Paste this URL into your website form to automatically send leads into LeadPulse
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 16px',
        }}>
          <code style={{ flex: 1, fontSize: '13px', color: '#374151', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {`${window.location.origin}/api/webhook/leads/${agent?.id}`}
          </code>
          <button
            onClick={copyWebhook}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: copied ? '#10b981' : '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s ease',
              flexShrink: 0,
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
        </div>
      </div>

      {/* How It Works + Pro Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={16} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>How It Works</h3>
          </div>
          {[
            ['Submit leads', 'via your website form'],
            ['AI processes', 'and qualifies leads'],
            ['Auto-respond', 'with personalized messages'],
            ['Track metrics', 'in your dashboard'],
          ].map(([bold, rest], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '22px', height: '22px',
                background: '#7c3aed',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '11px', fontWeight: '700', flexShrink: 0,
              }}>{i + 1}</div>
              <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: '1.5' }}>
                <strong>{bold}</strong> {rest}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', background: '#d1fae5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={16} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>Pro Tips</h3>
          </div>
          {[
            'Set up follow-up sequences for better conversion',
            'Connect your CRM for seamless integration',
            'Customize AI responses in settings',
            'Monitor analytics to optimize performance',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
              <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: '1.5' }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
