import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, Zap, Clock, MessageSquare, X } from 'lucide-react';

export default function SequencesPage() {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    templateType: 'custom',
    steps: [{ delayHours: 0, messageType: 'email', subject: '', body: '' }]
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSequences();
  }, []);

  const fetchSequences = async () => {
    try {
      const response = await axios.get('/api/sequences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSequences(response.data.sequences);
    } catch (error) {
      console.error('Failed to fetch sequences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSequence = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sequences', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSequences();
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        templateType: 'custom',
        steps: [{ delayHours: 0, messageType: 'email', subject: '', body: '' }]
      });
    } catch (error) {
      console.error('Failed to create sequence:', error);
    }
  };

  const handleDeleteSequence = async (sequenceId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/sequences/${sequenceId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSequences();
      } catch (error) {
        console.error('Failed to delete sequence:', error);
      }
    }
  };

  const templateTypes = [
    { value: 'first_time_buyer', label: 'First-Time Buyer' },
    { value: 'investor', label: 'Investor' },
    { value: 'downsizer', label: 'Downsizer' },
    { value: 'custom', label: 'Custom' }
  ];

  const getTemplateIcon = (templateType) => {
    const icons = {
      first_time_buyer: '🏠',
      investor: '📊',
      downsizer: '🔄',
      custom: '⚙️'
    };
    return icons[templateType] || '⚙️';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Follow-Up Sequences</h1>
          <p className="text-gray-600 mt-2">Create and manage automated follow-up sequences for your leads</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0"
        >
          <Plus size={20} />
          <span className="font-semibold">New Sequence</span>
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="bg-purple-100 rounded-lg p-2">
                <Zap className="text-purple-600" size={24} />
              </div>
              <span>Create Sequence</span>
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleCreateSequence} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Sequence Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., First-Time Buyer Follow-up"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Template Type</label>
                <select
                  value={formData.templateType}
                  onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {templateTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose of this sequence..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                rows="3"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Sequence
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sequences Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading sequences...</p>
          </div>
        </div>
      ) : sequences.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Zap className="text-purple-600" size={32} />
          </div>
          <p className="text-gray-600 text-lg font-medium">No sequences yet</p>
          <p className="text-gray-500 text-sm mt-2">Create your first sequence to automate follow-ups with leads</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sequences.map(sequence => (
            <div
              key={sequence.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{getTemplateIcon(sequence.templateType)}</div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg bg-white hover:bg-gray-100 text-purple-600 transition-all">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSequence(sequence.id)}
                      className="p-2 rounded-lg bg-white hover:bg-red-50 text-red-600 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{sequence.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{sequence.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Template Type Badge */}
                <div className="flex items-center space-x-2">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {templateTypes.find(t => t.value === sequence.templateType)?.label || sequence.templateType}
                  </span>
                </div>

                {/* Steps Info */}
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <MessageSquare size={16} className="text-purple-600" />
                  <span>
                    <strong>{sequence.stepsCount}</strong> {sequence.stepsCount === 1 ? 'step' : 'steps'}
                  </span>
                </div>

                {/* Action Buttons - Mobile */}
                <div className="flex gap-2 md:hidden pt-4 border-t border-gray-200">
                  <button className="flex-1 p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 text-sm font-semibold transition-all">
                    <Edit size={16} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDeleteSequence(sequence.id)}
                    className="flex-1 p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 text-sm font-semibold transition-all"
                  >
                    <Trash2 size={16} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
