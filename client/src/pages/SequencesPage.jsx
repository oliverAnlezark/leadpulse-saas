import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Follow-Up Sequences</h1>
          <p className="text-gray-600 mt-1">Create and manage automated follow-up sequences</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>New Sequence</span>
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create Sequence</h2>
          <form onSubmit={handleCreateSequence} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sequence Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Type</label>
                <select
                  value={formData.templateType}
                  onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {templateTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Create Sequence
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sequences List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading sequences...</div>
        ) : sequences.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No sequences yet. Create one to get started!</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sequences.map(sequence => (
              <div key={sequence.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{sequence.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {sequence.templateType}
                      </span>
                      <span className="text-xs text-gray-600">
                        {sequence.stepsCount} steps
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSequence(sequence.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
