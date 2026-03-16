import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { TrendingUp, Users, MessageSquare, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { agent } = useAuthStore();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  const StatCard = ({ icon: Icon, label, value, change }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && <p className="text-green-600 text-sm mt-1">{change}</p>}
        </div>
        <Icon className="text-blue-600" size={32} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {agent?.fullName || 'Agent'}!</h1>
        <p className="text-gray-600 mt-2">{agent?.companyName || 'Your Real Estate Company'}</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
          ))}
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Leads"
            value={analytics.leads.total}
            change={`${analytics.leads.qualified} qualified`}
          />
          <StatCard
            icon={CheckCircle}
            label="Converted"
            value={analytics.leads.converted}
            change={`${analytics.leads.hot} hot leads`}
          />
          <StatCard
            icon={MessageSquare}
            label="Messages Sent"
            value={analytics.communications.reduce((sum, c) => sum + c.sent, 0)}
            change={`${analytics.communications.reduce((sum, c) => sum + c.delivered, 0)} delivered`}
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Response"
            value={`${analytics.responseTime.average}m`}
            change={`${analytics.responseTime.min}m - ${analytics.responseTime.max}m`}
          />
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/leads"
            className="p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <p className="font-medium text-blue-600">View Leads</p>
            <p className="text-sm text-gray-600 mt-1">Manage your lead pipeline</p>
          </a>
          <a
            href="/sequences"
            className="p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <p className="font-medium text-gray-900">Create Sequence</p>
            <p className="text-sm text-gray-600 mt-1">Set up follow-up automation</p>
          </a>
          <a
            href="/settings"
            className="p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <p className="font-medium text-gray-900">Configure CRM</p>
            <p className="text-sm text-gray-600 mt-1">Connect your CRM integration</p>
          </a>
        </div>
      </div>

      {/* Webhook Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">Webhook URL for Lead Intake</h3>
        <p className="text-blue-800 text-sm mb-4">Use this URL to send leads from your website form:</p>
        <div className="bg-white p-3 rounded border border-blue-300 font-mono text-sm text-gray-700 break-all">
          {`${window.location.origin}/api/webhook/leads/${agent?.id}`}
        </div>
      </div>
    </div>
  );
}
