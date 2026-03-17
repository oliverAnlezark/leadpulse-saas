import { useEffect, useState } from 'react';
import { useLeadsStore } from '../store/leadsStore';
import { Trash2, Eye, Filter, X, Mail, Phone, Home, Calendar, DollarSign } from 'lucide-react';

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
      new: 'bg-blue-100 text-blue-800 border-blue-300',
      contacted: 'bg-purple-100 text-purple-800 border-purple-300',
      qualified: 'bg-green-100 text-green-800 border-green-300',
      converted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      lost: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getScoreColor = (score) => {
    const colors = {
      hot: 'bg-red-100 text-red-700 border-red-300',
      warm: 'bg-orange-100 text-orange-700 border-orange-300',
      cold: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[score] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-2">Manage and track your lead pipeline</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5 flex items-center space-x-3 overflow-x-auto">
        <Filter size={20} className="text-purple-600 flex-shrink-0" />
        <div className="flex space-x-2">
          {['all', 'new', 'contacted', 'qualified', 'converted'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                filter === status
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 mt-4">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No leads found</p>
            <p className="text-gray-500 text-sm mt-2">Start by creating a new lead or connecting your CRM</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-purple-100 border-b-2 border-purple-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Source</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-purple-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 cursor-pointer transition-all ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 inline-block ${getScoreColor(lead.score)}`}>
                        {lead.score?.charAt(0).toUpperCase() + lead.score?.slice(1) || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.leadSource}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        title="Delete lead"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto border border-purple-100">
            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 p-6 flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedLead.firstName} {selectedLead.lastName}
              </h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-lg hover:bg-purple-200 text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Mail className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="font-semibold text-gray-900">{selectedLead.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedLead.phone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Home className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Property Interest</p>
                    <p className="font-semibold text-gray-900">{selectedLead.propertyInterest || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Timeline</p>
                    <p className="font-semibold text-gray-900">{selectedLead.timeline || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="text-purple-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Budget</p>
                    <p className="font-semibold text-gray-900">
                      {selectedLead.budget?.min ? `$${selectedLead.budget.min} - $${selectedLead.budget.max}` : '-'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Lead Source</p>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
                    {selectedLead.leadSource}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
