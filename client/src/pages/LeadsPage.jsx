import { useEffect, useState } from 'react';
import { useLeadsStore } from '../store/leadsStore';
import { Trash2, Eye, Filter } from 'lucide-react';

export default function LeadsPage() {
  const { leads, getLeads, updateLeadStatus, deleteLead, loading } = useLeadsStore();
  const [filter, setFilter] = useState('all');
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

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score) => {
    const colors = {
      hot: 'text-red-600',
      warm: 'text-orange-600',
      cold: 'text-blue-600'
    };
    return colors[score] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-1">Manage and track your leads</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
        <Filter size={20} className="text-gray-600" />
        {['all', 'new', 'contacted', 'qualified', 'converted'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Source</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${getScoreColor(lead.score)}`}>
                      {lead.score?.charAt(0).toUpperCase() + lead.score?.slice(1) || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.leadSource}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedLead.firstName} {selectedLead.lastName}
                </h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{selectedLead.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Property Interest</p>
                  <p className="font-medium text-gray-900">{selectedLead.propertyInterest || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timeline</p>
                  <p className="font-medium text-gray-900">{selectedLead.timeline || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium text-gray-900">
                    {selectedLead.budget?.min ? `$${selectedLead.budget.min} - $${selectedLead.budget.max}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lead Source</p>
                  <p className="font-medium text-gray-900">{selectedLead.leadSource}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
