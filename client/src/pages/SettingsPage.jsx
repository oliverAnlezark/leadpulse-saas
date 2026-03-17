import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Save, Plus, Trash2, Settings, Zap, Lock, AlertCircle } from 'lucide-react';

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
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and integrations</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-100 rounded-lg p-2">
            <Settings className="text-purple-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
              <input
                type="text"
                value={profileData.companyName}
                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Timezone</label>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">AI Response Template</label>
            <textarea
              value={profileData.aiPromptTemplate}
              onChange={(e) => setProfileData({ ...profileData, aiPromptTemplate: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              rows="4"
              placeholder="Customize how the AI responds to leads..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Use variables like {'{'}firstName{'}'}, {'{'}propertyType{'}'}, {'{'}budget{'}'} to personalize responses
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* CRM Integrations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Zap className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">CRM Integrations</h2>
          </div>
          <button
            onClick={() => setShowIntegrationForm(!showIntegrationForm)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg font-semibold flex-shrink-0"
          >
            <Plus size={20} />
            <span>Add Integration</span>
          </button>
        </div>

        {/* Add Integration Form */}
        {showIntegrationForm && (
          <form onSubmit={handleAddIntegration} className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">CRM Type</label>
                <select
                  value={integrationForm.crmType}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, crmType: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {crmOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">API Key</label>
                <input
                  type="password"
                  value={integrationForm.apiKey}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, apiKey: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">API Secret (Optional)</label>
                <input
                  type="password"
                  value={integrationForm.apiSecret}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, apiSecret: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Account ID (Optional)</label>
                <input
                  type="text"
                  value={integrationForm.accountId}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, accountId: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-purple-200">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Add Integration
              </button>
              <button
                type="button"
                onClick={() => setShowIntegrationForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Integrations List */}
        <div className="space-y-3">
          {integrations.length === 0 ? (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Lock className="text-gray-600" size={24} />
              </div>
              <p className="text-gray-600 font-medium">No integrations configured yet</p>
              <p className="text-gray-500 text-sm mt-1">Connect your CRM to sync leads automatically</p>
            </div>
          ) : (
            integrations.map(integration => (
              <div
                key={integration.id}
                className="flex justify-between items-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Zap className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 capitalize text-lg">{integration.crmType}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Status:{' '}
                      <span
                        className={`font-semibold ${
                          integration.isActive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {integration.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteIntegration(integration.id)}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                  title="Delete integration"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6 flex items-start space-x-4">
        <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
          <AlertCircle className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-blue-900">Security Notice</h3>
          <p className="text-blue-800 text-sm mt-1">
            Your API keys and secrets are encrypted and stored securely. Never share your credentials with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}
