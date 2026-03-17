import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle,
  Copy,
  ArrowRight,
  Zap,
  Activity,
  Target,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { agent } = useAuthStore();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
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

  const copyWebhook = () => {
    const webhookUrl = `${window.location.origin}/api/webhook/leads/${agent?.id}`;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StatCard = ({ icon: Icon, label, value, change, trend, color = 'purple' }) => {
    const colorClasses = {
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      orange: 'from-orange-500 to-orange-600',
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className="text-green-600 text-sm font-medium mt-3 flex items-center space-x-1">
                <TrendingUp size={14} />
                <span>{change}</span>
              </p>
            )}
          </div>
          <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 shadow-lg`}>
            <Icon className="text-white" size={28} />
          </div>
        </div>
      </div>
    );
  };

  const ActionCard = ({ icon: Icon, title, description, href, isPrimary = false }) => (
    <a
      href={href}
      className={`group relative overflow-hidden rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        isPrimary
          ? 'bg-gradient-to-br from-purple-600 to-purple-700 border-purple-700 text-white shadow-lg'
          : 'bg-white border-gray-200 hover:border-purple-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <div
              className={`p-2 rounded-lg ${
                isPrimary ? 'bg-white bg-opacity-20' : 'bg-purple-100'
              }`}
            >
              <Icon className={isPrimary ? 'text-white' : 'text-purple-600'} size={24} />
            </div>
          </div>
          <h3 className={`font-bold text-lg mb-1 ${isPrimary ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm ${isPrimary ? 'text-purple-100' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
        <ArrowRight
          className={`${isPrimary ? 'text-white' : 'text-purple-600'} opacity-0 group-hover:opacity-100 transition-opacity`}
          size={20}
        />
      </div>
    </a>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {agent?.fullName || 'Agent'}! 👋</h1>
        <p className="text-purple-100 text-lg">{agent?.companyName || 'Your Real Estate Company'}</p>
      </div>

      {/* Key Metrics Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl h-40 animate-pulse"
            ></div>
          ))}
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Leads"
            value={analytics.leads.total}
            change={`${analytics.leads.qualified} qualified`}
            color="purple"
          />
          <StatCard
            icon={CheckCircle}
            label="Converted"
            value={analytics.leads.converted}
            change={`${analytics.leads.hot} hot leads`}
            color="green"
          />
          <StatCard
            icon={MessageSquare}
            label="Messages Sent"
            value={analytics.communications.reduce((sum, c) => sum + c.sent, 0)}
            change={`${analytics.communications.reduce((sum, c) => sum + c.delivered, 0)} delivered`}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Avg Response"
            value={`${analytics.responseTime.average}m`}
            change={`${analytics.responseTime.min}m - ${analytics.responseTime.max}m`}
            color="orange"
          />
        </div>
      ) : null}

      {/* Quick Actions Section */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-600 rounded-lg p-2">
            <Zap className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            icon={Users}
            title="View Leads"
            description="Manage your lead pipeline and track progress"
            href="/leads"
            isPrimary={true}
          />
          <ActionCard
            icon={MessageSquare}
            title="Create Sequence"
            description="Set up follow-up automation for leads"
            href="/sequences"
          />
          <ActionCard
            icon={CheckCircle}
            title="Configure CRM"
            description="Connect your CRM integration"
            href="/settings"
          />
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-purple-100 rounded-lg p-2">
                <AlertCircle className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Webhook URL for Lead Intake</h3>
            </div>
            <p className="text-gray-600 text-sm">Use this URL to send leads from your website form:</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm text-gray-700 break-all flex items-center justify-between group hover:border-purple-300 transition-colors">
          <span className="text-xs">{`${window.location.origin}/api/webhook/leads/${agent?.id}`}</span>
          <button
            onClick={copyWebhook}
            className="ml-4 p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors flex-shrink-0"
            title="Copy webhook URL"
          >
            <Copy size={18} />
          </button>
        </div>
        {copied && (
          <p className="text-green-700 text-sm mt-3 font-medium animate-fade-in">
            ✓ Webhook URL copied to clipboard!
          </p>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 rounded-lg p-2">
              <Activity className="text-blue-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">How It Works</h3>
          </div>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
              <span>
                <span className="font-medium text-gray-900">Submit leads</span> via your website form
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
              <span>
                <span className="font-medium text-gray-900">AI processes</span> and qualifies leads
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
              <span>
                <span className="font-medium text-gray-900">Auto-respond</span> with personalized messages
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
              <span>
                <span className="font-medium text-gray-900">Track metrics</span> in your dashboard
              </span>
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 rounded-lg p-2">
              <Target className="text-green-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Pro Tips</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start space-x-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Set up follow-up sequences for better conversion</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Connect your CRM for seamless integration</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Customize AI responses in settings</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Monitor analytics to optimize performance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
