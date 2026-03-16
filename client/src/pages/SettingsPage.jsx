import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { agent, updateProfile } = useAuthStore();
  const [profileData, setProfileData] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    timezone: 'Australia/Sydney',
    aiPromptTemplate: ''
  });
  const [integrations, setIntegrations] = useState([]);
  const [showIntegrationForm, setShowIntegrationForm] = useState(false);
  const [integrationForm, setIntegrationForm] = useState({
    crmType: 'hubspot',
    apiKey: '',
    apiSecret: '',
    accountId: ''
  });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (agent) {
      setProfileData({
        fullName: agent.fullName || '',
        companyName: agent.companyName || '',
        phone: agent.phone || '',
        timezone: agent.timezone || 'Australia/Sydney',
        aiPromptTemplate: agent.aiPromptTemplate || ''
      });
    }
    fetchIntegrations();
  }, [agent]);

  const fetchIntegrations = async () => {
    try {
      const response = await axios.get('/api/crm/integrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIntegrations(response.data.integrations);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileData);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddIntegration = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/crm/integrations', integrationForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchIntegrations();
      setShowIntegrationForm(false);
      setIntegrationForm({ crmType: 'hubspot', apiKey: '', apiSecret: '', accountId: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add integration');
    }
  };

  const handleDeleteIntegration = async (integrationId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/crm/integrations/${integrationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchIntegrations();
      } catch (error) {
        alert('Failed to delete integration');
      }
    }
  };

  const crmOptions = [
    { value: 'hubspot', label: 'HubSpot' },
    { value: 'real_estate_view', label: 'Real Estate View' },
    { value: 'rein', label: 'REIN' },
    { value: 'generic', label: 'Generic Webhook' }
  ];

  const timezones = [
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Australia/Perth',
    'Australia/Adelaide',
    'Australia/Hobart'
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and integrations</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={profileData.companyName}
                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Response Template</label>
            <textarea
              value={profileData.aiPromptTemplate}
              onChange={(e) => setProfileData({ ...profileData, aiPromptTemplate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Customize how the AI responds to leads..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* CRM Integrations */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">CRM Integrations</h2>
          <button
            onClick={() => setShowIntegrationForm(!showIntegrationForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>Add Integration</span>
          </button>
        </div>

        {/* Add Integration Form */}
        {showIntegrationForm && (
          <form onSubmit={handleAddIntegration} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CRM Type</label>
                <select
                  value={integrationForm.crmType}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, crmType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {crmOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={integrationForm.apiKey}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, apiKey: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Secret (Optional)</label>
                <input
                  type="password"
                  value={integrationForm.apiSecret}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, apiSecret: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account ID (Optional)</label>
                <input
                  type="text"
                  value={integrationForm.accountId}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, accountId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Integration
              </button>
              <button
                type="button"
                onClick={() => setShowIntegrationForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Integrations List */}
        <div className="space-y-3">
          {integrations.length === 0 ? (
            <p className="text-gray-600">No integrations configured yet</p>
          ) : (
            integrations.map(integration => (
              <div key={integration.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{integration.crmType}</p>
                  <p className="text-sm text-gray-600">
                    Status: <span className={integration.isActive ? 'text-green-600' : 'text-red-600'}>
                      {integration.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteIntegration(integration.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
