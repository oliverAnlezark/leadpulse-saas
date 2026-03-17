import { useState, useEffect } from 'react';
import { useLeadsStore } from '../store/leadsStore';
import {
  Users, Search, Plus, Filter, Eye, X,
  Mail, Phone, Home, Calendar, DollarSign,
  Star, UserCheck, TrendingUp, Trash2
} from 'lucide-react';

const STATUS_CONFIG = {
  new:        { label: 'New',        color: '#3b82f6', bg: '#dbeafe' },
  contacted:  { label: 'Contacted',  color: '#f59e0b', bg: '#fef3c7' },
  qualified:  { label: 'Qualified',  color: '#8b5cf6', bg: '#ede9fe' },
  converted:  { label: 'Converted',  color: '#10b981', bg: '#d1fae5' },
  lost:       { label: 'Lost',       color: '#ef4444', bg: '#fee2e2' },
};

const TABS = ['All', 'New', 'Contacted', 'Qualified', 'Converted'];

export default function LeadsPage() {
  const { leads, getLeads, updateLeadStatus, deleteLead, loading } = useLeadsStore();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const status = activeTab === 'All' ? null : activeTab.toLowerCase();
    getLeads(status);
  }, [activeTab]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus, null);
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const handleDelete = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(leadId);
      } catch (error) {
        console.error('Failed to delete lead:', error);
      }
    }
  };

  const filtered = leads.filter(l => {
    const matchSearch = !search ||
      `${l.firstName} ${l.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const counts = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  const metricCards = [
    { label: 'Total Leads',  value: counts.total,     sub: 'All time',          icon: Users,     color: '#7c3aed', bg: '#f3e8ff' },
    { label: 'New',          value: counts.new,        sub: 'Awaiting contact',  icon: Star,      color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Qualified',    value: counts.qualified,  sub: 'High potential',    icon: UserCheck, color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Converted',    value: counts.converted,  sub: 'Closed deals',      icon: TrendingUp,color: '#10b981', bg: '#d1fae5' },
  ];

  const getScoreStyle = (score) => {
    const map = {
      hot:  { color: '#ef4444', bg: '#fee2e2' },
      warm: { color: '#f59e0b', bg: '#fef3c7' },
      cold: { color: '#3b82f6', bg: '#dbeafe' },
    };
    return map[score] || { color: '#6b7280', bg: '#f3f4f6' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        borderRadius: '16px',
        padding: '28px 36px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0', color: 'white' }}>
            Lead Pipeline
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.95)', fontSize: '14px', fontWeight: '500' }}>
            Manage and track every lead through your sales process
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6',
              display: 'flex', alignItems: 'flex-start', gap: '14px',
            }}>
              <div style={{
                width: '46px', height: '46px', background: card.bg,
                borderRadius: '10px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
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

      {/* Search + Tabs + Table */}
      <div style={{
        background: 'white', borderRadius: '12px',
        border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {/* Toolbar */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
          display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
        }}>
          <div style={{
            flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px',
            background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px',
          }}>
            <Search size={15} color="#9ca3af" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search leads by name or email..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#374151', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                  border: 'none', cursor: 'pointer',
                  background: activeTab === tab ? '#7c3aed' : 'transparent',
                  color: activeTab === tab ? 'white' : '#6b7280',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            Loading leads...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', background: '#f3e8ff', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <Users size={28} color="#7c3aed" />
            </div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 6px 0' }}>No leads found</p>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              {search ? 'Try a different search term' : 'Start by creating a new lead or connecting your CRM'}
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Name', 'Contact', 'Property', 'Budget', 'Score', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: '700', color: '#6b7280', textTransform: 'uppercase',
                    letterSpacing: '0.05em', borderBottom: '1px solid #f3f4f6',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const st = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                const sc = getScoreStyle(lead.score);
                return (
                  <tr key={lead.id || i}
                    style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: '13px', fontWeight: '700', flexShrink: 0,
                        }}>
                          {lead.firstName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{lead.firstName} {lead.lastName}</p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{lead.leadSource || 'Direct'}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 2px 0' }}>{lead.email || '—'}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{lead.phone || '—'}</p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{lead.propertyInterest || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                      {lead.budget?.min ? `$${Number(lead.budget.min).toLocaleString()}` : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {lead.score && (
                        <span style={{
                          display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                          background: sc.bg, color: sc.color, fontSize: '12px', fontWeight: '600',
                          textTransform: 'capitalize',
                        }}>{lead.score}</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '4px 10px', borderRadius: '20px',
                        background: st.bg, color: st.color, fontSize: '12px', fontWeight: '600',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.color }} />
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          style={{
                            width: '30px', height: '30px', borderRadius: '6px',
                            background: '#f3e8ff', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        ><Eye size={14} color="#7c3aed" /></button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          style={{
                            width: '30px', height: '30px', borderRadius: '6px',
                            background: '#fee2e2', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        ><Trash2 size={14} color="#ef4444" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            background: 'white', borderRadius: '16px',
            width: '100%', maxWidth: '520px', maxHeight: '90vh',
            overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              padding: '24px 28px', borderRadius: '16px 16px 0 0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: '0 0 4px 0' }}>
                  {selectedLead.firstName} {selectedLead.lastName}
                </h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{selectedLead.email}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'white' }}
              ><X size={18} /></button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {[
                  { icon: Mail, color: '#3b82f6', bg: '#dbeafe', label: 'Email', value: selectedLead.email },
                  { icon: Phone, color: '#10b981', bg: '#d1fae5', label: 'Phone', value: selectedLead.phone || '—' },
                  { icon: Home, color: '#f59e0b', bg: '#fef3c7', label: 'Property', value: selectedLead.propertyInterest || '—' },
                  { icon: Calendar, color: '#8b5cf6', bg: '#ede9fe', label: 'Timeline', value: selectedLead.timeline || '—' },
                  { icon: DollarSign, color: '#ef4444', bg: '#fee2e2', label: 'Budget', value: selectedLead.budget?.min ? `$${Number(selectedLead.budget.min).toLocaleString()} – $${Number(selectedLead.budget.max).toLocaleString()}` : '—' },
                ].map(({ icon: Icon, color, bg, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={color} />
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                      <p style={{ fontSize: '13px', color: '#111827', fontWeight: '600', margin: 0 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>Update Status</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    handleStatusChange(selectedLead.id, e.target.value);
                    setSelectedLead({ ...selectedLead, status: e.target.value });
                  }}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
                    borderRadius: '8px', fontSize: '14px', color: '#111827', outline: 'none',
                    background: 'white', cursor: 'pointer',
                  }}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
