import { useEffect, useState } from 'react';
import { useLeadsStore } from '../store/leadsStore';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-2">Manage and track your lead pipeline</p>
        </div>
        <button
          onClick={() => navigate('/import')}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0"
        >
          <Plus size={20} />
          <span className="font-semibold">Import Leads</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-600" />
          <div className="flex space-x-2">
            {['all', ...statuses].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading leads...</p>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Eye size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No leads found</p>
          <p className="text-gray-500 mt-2">Start by creating a new lead or importing from a file</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map(lead => {
                  const statusColor = getStatusColor(lead.leadStatus);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {lead.firstName?.charAt(0)}{lead.lastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{lead.firstName} {lead.lastName}</p>
                            <p className="text-sm text-gray-500">{lead.leadSource}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {lead.email && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail size={16} />
                              <span>{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone size={16} />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Home size={16} />
                          <span>{lead.propertyInterest || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.leadStatus}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium border-0 cursor-pointer ${statusColor.badge}`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getScoreColor(lead.leadScore)}`}>
                          {lead.leadScore?.toUpperCase() || 'Cold'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete lead"
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
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-medium">First Name</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Last Name</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.phone || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 font-medium">Property Interest</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.propertyInterest || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Status</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.leadStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Score</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.leadScore || 'Cold'}</p>
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Notes</p>
                  <p className="text-gray-900">{selectedLead.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
