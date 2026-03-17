import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, MessageSquare, Clock, CheckCircle,
  BarChart2, Activity, Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(res.data);
      } catch { setAnalytics(null); }
      finally { setLoading(false); }
    };
    if (token) fetchData();
  }, [token]);

  const totalMessages = analytics?.communications?.reduce((s, c) => s + c.sent, 0) ?? 0;
  const totalDelivered = analytics?.communications?.reduce((s, c) => s + c.delivered, 0) ?? 0;
  const deliveryRate = totalMessages > 0 ? Math.round((totalDelivered / totalMessages) * 100) : 0;
  const conversionRate = analytics?.leads?.total > 0
    ? Math.round((analytics.leads.converted / analytics.leads.total) * 100) : 0;

  const metricCards = [
    { label: 'Total Leads', value: analytics?.leads?.total ?? 0, sub: `${analytics?.leads?.new ?? 0} new this period`, icon: Users, color: '#7c3aed', bg: '#f3e8ff', trend: '+12%', up: true },
    { label: 'Converted', value: analytics?.leads?.converted ?? 0, sub: `${analytics?.leads?.qualified ?? 0} qualified`, icon: CheckCircle, color: '#10b981', bg: '#d1fae5', trend: '+8%', up: true },
    { label: 'Messages Sent', value: totalMessages, sub: `${deliveryRate}% delivery rate`, icon: MessageSquare, color: '#3b82f6', bg: '#dbeafe', trend: '+24%', up: true },
    { label: 'Avg Response', value: `${analytics?.responseTime?.average ?? 0}m`, sub: `${analytics?.responseTime?.min ?? 0}m to ${analytics?.responseTime?.max ?? 0}m range`, icon: Clock, color: '#f59e0b', bg: '#fef3c7', trend: '-5%', up: false },
  ];

  const statRows = [
    { label: 'New Leads', value: analytics?.leads?.new ?? 0, color: '#3b82f6' },
    { label: 'Contacted', value: analytics?.leads?.contacted ?? 0, color: '#f59e0b' },
    { label: 'Qualified', value: analytics?.leads?.qualified ?? 0, color: '#8b5cf6' },
    { label: 'Converted', value: analytics?.leads?.converted ?? 0, color: '#10b981' },
    { label: 'Lost', value: analytics?.leads?.lost ?? 0, color: '#ef4444' },
  ];
  const maxVal = Math.max(...statRows.map(r => r.value), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', borderRadius: '16px', padding: '28px 36px', color: 'white', boxShadow: '0 8px 32px rgba(124,58,237,0.2)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0', color: 'white' }}>Analytics</h1>
        <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>Track your performance metrics and optimise your lead generation</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '46px', height: '46px', background: card.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={card.color} />
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: '700', color: card.up ? '#10b981' : '#ef4444', background: card.up ? '#d1fae5' : '#fee2e2', padding: '3px 8px', borderRadius: '20px' }}>
                  {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {card.trend}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
              <p style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: '0 0 3px 0', lineHeight: 1 }}>{card.value}</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{card.sub}</p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '32px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={16} color="#7c3aed" />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>Pipeline Breakdown</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {statRows.map(row => {
              const pct = Math.round((row.value / maxVal) * 100);
              return (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', color: '#111827', fontWeight: '700' }}>{row.value}</span>
                  </div>
                  <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: row.color, borderRadius: '4px', minWidth: row.value > 0 ? '4px' : '0' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '32px', background: '#d1fae5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={16} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>Conversion Rate</h3>
          </div>
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#10b981 ${conversionRate * 3.6}deg, #f3f4f6 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'inset 0 0 0 20px white' }}>
              <p style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>{conversionRate}%</p>
            </div>
            <p style={{ fontSize: '14px', color: '#374151', fontWeight: '600', margin: '0 0 4px 0' }}>Lead-to-Close Rate</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{analytics?.leads?.converted ?? 0} of {analytics?.leads?.total ?? 0} leads converted</p>
          </div>
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0' }}>Communications</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {(analytics?.communications || []).map((c, i) => (
                <div key={i} style={{ flex: 1, background: '#f9fafb', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 2px 0' }}>{c.sent}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0, textTransform: 'capitalize' }}>{c.channel}</p>
                </div>
              ))}
              {(!analytics?.communications || analytics.communications.length === 0) && (
                <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>No communication data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '32px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={16} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>Response Time Performance</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Average', value: `${analytics?.responseTime?.average ?? 0}m`, color: '#f59e0b', bg: '#fef3c7', desc: 'Mean response time' },
            { label: 'Fastest', value: `${analytics?.responseTime?.min ?? 0}m`, color: '#10b981', bg: '#d1fae5', desc: 'Best response time' },
            { label: 'Slowest', value: `${analytics?.responseTime?.max ?? 0}m`, color: '#ef4444', bg: '#fee2e2', desc: 'Worst response time' },
          ].map(item => (
            <div key={item.label} style={{ background: item.bg, borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: item.color, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>{item.label}</p>
              <p style={{ fontSize: '32px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', lineHeight: 1 }}>{item.value}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
