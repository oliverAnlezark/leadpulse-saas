import { useEffect, useState } from 'react';
import { useLeadsStore } from '../store/leadsStore';
import { Trash2, Eye, Filter, X, Mail, Phone, Home, Calendar, DollarSign, Search, ChevronDown } from 'lucide-react';

export default function LeadsPage() {
  const { leads, getLeads, updateLeadStatus, deleteLead, loading } = useLeadsStore();
  const [filter, setFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const getStatusColor = (status) => {
    const colors = {
      new: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
      contacted: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
      qualified: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
      converted: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
      lost: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    };
    return colors[status] || colors.new;
  };

  const getScoreColor = (score) => {
    const colors = {
      hot: 'bg-red-100 text-red-700 border-red-300',
      warm: 'bg-orange-100 text-orange-700 border-orange-300',
      cold: 'bg-blue-100 text-blue-700 border-blue-300',
    };
    return colors[score] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const filteredLeads = leads.filter(lead =>
    searchQuery === ''
      ? true
      : `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];

  return (
    <div style={{ padding: '40px 60px', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Leads</h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>Manage and track your lead pipeline</p>
      </div>

      {/* Search and Filter Bar */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '16px',
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af', width: '20px', height: '20px' }} />
            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Filter style={{ color: '#6b7280', width: '20px', height: '20px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', ...statuses].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    background: filter === status ? '#9333ea' : '#f3f4f6',
                    color: filter === status ? 'white' : '#374151',
                    transition: 'all 0.2s',
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #9333ea', borderRadius: '50%' }} />
          </div>
          <p style={{ color: '#6b7280' }}>Loading leads...</p>
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
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Contact</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Property</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Score</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => {
                const statusColor = getStatusColor(lead.leadStatus);
                return (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}>
                          {lead.firstName?.charAt(0)}{lead.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', color: '#111827' }}>{lead.firstName} {lead.lastName}</p>
                          <p style={{ fontSize: '14px', color: '#6b7280' }}>{lead.leadSource}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {lead.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                            <Mail size={16} />
                            <span>{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                            <Phone size={16} />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                        <Home size={16} />
                        <span>{lead.propertyInterest || '-'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
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
                          background: statusColor.badge.split(' ')[0].replace('bg-', '') === 'blue-100' ? '#dbeafe' : statusColor.badge.split(' ')[0].replace('bg-', '') === 'purple-100' ? '#e9d5ff' : statusColor.badge.split(' ')[0].replace('bg-', '') === 'green-100' ? '#dcfce7' : statusColor.badge.split(' ')[0].replace('bg-', '') === 'emerald-100' ? '#d1fae5' : '#fee2e2',
                          color: statusColor.badge.split(' ')[1],
                        }}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        background: getScoreColor(lead.leadScore).split(' ')[0].replace('bg-', '') === 'red-100' ? '#fee2e2' : getScoreColor(lead.leadScore).split(' ')[0].replace('bg-', '') === 'orange-100' ? '#fed7aa' : '#dbeafe',
                        color: getScoreColor(lead.leadScore).split(' ')[1],
                      }}>
                        {lead.leadScore?.toUpperCase() || 'Cold'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          style={{
                            padding: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          style={{
                            padding: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          <Trash2 size={18} />
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
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(to right, #9333ea, #7e22ce)',
              color: 'white',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                style={{
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>First Name</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{selectedLead.firstName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>Last Name</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{selectedLead.lastName}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{selectedLead.email || '-'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>Phone</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{selectedLead.phone || '-'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>Property Interest</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{selectedLead.propertyInterest || '-'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>Status</p>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => {
                      handleStatusChange(selectedLead.id, e.target.value);
                      setSelectedLead({ ...selectedLead, status: e.target.value });
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
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>Score</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{selectedLead.leadScore || 'Cold'}</p>
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Notes</p>
                  <p style={{ color: '#111827' }}>{selectedLead.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
