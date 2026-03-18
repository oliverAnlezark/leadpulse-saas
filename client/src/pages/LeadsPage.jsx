import { useState, useEffect } from 'react';
import { useLeadsStore } from '../store/leadsStore';
import { Search, Filter, Eye, Trash2, Mail, Phone, MapPin } from 'lucide-react';

export default function LeadsPage() {
  const { leads, getLeads, updateLeadStatus, deleteLead, loading } = useLeadsStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const status = filter === 'all' ? null : filter;
    getLeads(status);
  }, [filter]);

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

  const filteredLeads = leads.filter(lead =>
    searchQuery === ''
      ? true
      : `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.leadStatus === 'new').length,
    contacted: leads.filter(l => l.leadStatus === 'contacted').length,
    qualified: leads.filter(l => l.leadStatus === 'qualified').length,
  };

  const statuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];

  const getStatusColor = (status) => {
    const colors = {
      new: { bg: '#dbeafe', text: '#1e40af', label: 'New' },
      contacted: { bg: '#e9d5ff', text: '#6b21a8', label: 'Contacted' },
      qualified: { bg: '#dcfce7', text: '#15803d', label: 'Qualified' },
      converted: { bg: '#d1fae5', text: '#065f46', label: 'Converted' },
      lost: { bg: '#fee2e2', text: '#991b1b', label: 'Lost' },
    };
    return colors[status] || colors.new;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          color: 'white',
          padding: '40px',
          borderRadius: '16px',
          margin: '24px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Leads</h1>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>Manage and track your lead pipeline</p>
        </div>
        <button
          style={{
            background: 'white',
            color: '#7c3aed',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
        >
          + Import Leads
        </button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          padding: '0 24px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: '#f3e8ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              📊
            </div>
            <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Total Leads</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{stats.total}</div>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>All leads in pipeline</p>
        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: '#dbeafe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              ✨
            </div>
            <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>New</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{stats.new}</div>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>Newly received</p>
        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: '#e9d5ff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              📞
            </div>
            <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Contacted</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{stats.contacted}</div>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>Already reached out</p>
        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                background: '#dcfce7',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              ✅
            </div>
            <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Qualified</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>{stats.qualified}</div>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>Ready to convert</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }}
            />
            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                background: 'transparent',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={18} style={{ color: '#6b7280' }} />
            {['all', ...statuses].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filter === status ? '#7c3aed' : '#f3f4f6',
                  color: filter === status ? 'white' : '#374151',
                  fontWeight: '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (filter !== status) e.currentTarget.style.background = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  if (filter !== status) e.currentTarget.style.background = '#f3f4f6';
                }}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div style={{ padding: '0 24px', marginBottom: '24px', flex: 1, overflow: 'auto' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div
            style={{
              display: 'inline-block',
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #7c3aed',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ color: '#6b7280', marginTop: '16px' }}>Loading leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '48px 20px',
          textAlign: 'center',
        }}>
          <Eye style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', fontSize: '18px' }}>No leads found</p>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>Start by importing leads from a file or connecting your CRM</p>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Contact</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Property</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Source</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => {
                const statusColor = getStatusColor(lead.leadStatus);
                return (                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px',
                          }}
                        >
                          {lead.firstName?.charAt(0)}{lead.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p style={{ fontSize: '12px', color: '#9ca3af' }}>{lead.leadSource || 'Unknown'}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {lead.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
                            <Mail size={14} />
                            <span>{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
                            <Phone size={14} />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
                        <MapPin size={14} />
                        <span>{lead.propertyInterest || '-'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <select
                        value={lead.leadStatus}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          border: 'none',
                          cursor: 'pointer',
                          background: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>{lead.leadSource || '-'}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          style={{
                            padding: '6px 12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            transition: 'all 0.2s',
                            borderRadius: '6px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                            e.currentTarget.style.color = '#111827';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                            e.currentTarget.style.color = '#6b7280';
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            transition: 'all 0.2s',
                            borderRadius: '6px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px',
        }}>
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: 'white',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                style={{
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '24px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>First Name</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedLead.firstName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Last Name</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedLead.lastName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Email</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedLead.email || '-'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Phone</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedLead.phone || '-'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Property Interest</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedLead.propertyInterest || '-'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Status</p>
                  <select
                    value={selectedLead.leadStatus}
                    onChange={(e) => {
                      handleStatusChange(selectedLead.id, e.target.value);
                      setSelectedLead({ ...selectedLead, leadStatus: e.target.value });
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#111827',
                      outline: 'none',
                      background: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Source</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedLead.leadSource || '-'}</p>
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Notes</p>
                  <p style={{ color: '#111827', fontSize: '14px', lineHeight: '1.6' }}>{selectedLead.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
