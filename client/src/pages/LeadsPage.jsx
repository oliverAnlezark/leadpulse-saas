import { useState, useEffect } from 'react';
import { useLeadsStore } from '../store/leadsStore';
import {
  Trash2,
  Eye,
  Filter,
  X,
  Mail,
  Phone,
  Home,
  Calendar,
  DollarSign,
  Plus,
  Search,
  ChevronDown,
} from 'lucide-react';

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
      contacted: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-700',
      },
      qualified: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        badge: 'bg-green-100 text-green-700',
      },
      converted: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-700',
      },
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
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-2">Manage and track your lead pipeline</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Filter size={18} className="text-gray-600 flex-shrink-0" />
          {['all', 'new', 'contacted', 'qualified', 'converted'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap text-sm ${
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

      {/* Kanban Board View */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading leads...</p>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Eye size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No leads found</p>
          <p className="text-gray-500 text-sm mt-2">
            {searchQuery ? 'Try adjusting your search' : 'Start by creating a new lead or connecting your CRM'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            {statuses.map(status => {
              const statusLeads = filteredLeads.filter(lead => lead.status === status);
              const colors = getStatusColor(status);

              return (
                <div key={status} className="flex-shrink-0 w-80">
                  {/* Column Header */}
                  <div className={`rounded-t-xl border-2 ${colors.border} ${colors.bg} p-4 flex items-center justify-between`}>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold text-sm uppercase tracking-wider ${colors.text}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}>
                        {statusLeads.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards Container */}
                  <div className={`rounded-b-xl border-2 border-t-0 ${colors.border} ${colors.bg} p-4 min-h-96 space-y-3`}>
                    {statusLeads.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-gray-400">
                        <p className="text-sm text-center">No leads in this stage</p>
                      </div>
                    ) : (
                      statusLeads.map(lead => (
                        <div
                          key={lead.id}
                          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 cursor-pointer group"
                          onClick={() => setSelectedLead(lead)}
                        >
                          {/* Lead Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">
                                {lead.firstName} {lead.lastName}
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">{lead.email}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(lead.id);
                              }}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                              title="Delete lead"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Lead Info */}
                          <div className="space-y-2 mb-3 text-xs">
                            {lead.phone && (
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Phone size={12} className="flex-shrink-0" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                            {lead.propertyInterest && (
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Home size={12} className="flex-shrink-0" />
                                <span>{lead.propertyInterest}</span>
                              </div>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getScoreColor(lead.score)}`}>
                              {lead.score?.charAt(0).toUpperCase() + lead.score?.slice(1) || 'N/A'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLead(lead);
                              }}
                              className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition-all"
                              title="View details"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedLead.firstName} {selectedLead.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{selectedLead.email}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-lg hover:bg-purple-200 text-gray-600 transition-colors flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedLead.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                    <Phone className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedLead.phone || '-'}</p>
                  </div>
                </div>

                {/* Property Interest */}
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 rounded-lg p-2 flex-shrink-0">
                    <Home className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Property Interest</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedLead.propertyInterest || '-'}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 rounded-lg p-2 flex-shrink-0">
                    <Calendar className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Timeline</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedLead.timeline || '-'}</p>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 rounded-lg p-2 flex-shrink-0">
                    <DollarSign className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Budget</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {selectedLead.budget?.min ? `$${selectedLead.budget.min} - $${selectedLead.budget.max}` : '-'}
                    </p>
                  </div>
                </div>

                {/* Lead Source */}
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Lead Source</p>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
                    {selectedLead.leadSource}
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <label className="text-sm text-gray-600 font-medium block mb-3">Update Status</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    handleStatusChange(selectedLead.id, e.target.value);
                    setSelectedLead({ ...selectedLead, status: e.target.value });
                  }}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
