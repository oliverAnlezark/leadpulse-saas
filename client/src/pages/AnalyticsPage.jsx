import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, MessageSquare, Target } from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [sources, setSources] = useState([]);
  const [funnel, setFunnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, sourcesRes, funnelRes] = await Promise.all([
        axios.get('/api/analytics/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/analytics/lead-sources', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/analytics/funnel', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAnalytics(analyticsRes.data);
      setSources(sourcesRes.data.sources);
      setFunnel(funnelRes.data.funnel);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  const MetricCard = ({ icon: Icon, label, value, color = 'purple' }) => {
    const colorClasses = {
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      orange: 'from-orange-500 to-orange-600',
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 shadow-lg`}>
            <Icon className="text-white" size={24} />
          </div>
        </div>
      </div>
    );
  };

  const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <h2 className="text-lg font-bold text-gray-900 mb-6">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your performance metrics and optimize your lead generation</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      ) : analytics ? (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Users}
              label="Total Leads"
              value={analytics.leads.total}
              color="purple"
            />
            <MetricCard
              icon={Target}
              label="Qualified"
              value={analytics.leads.qualified}
              color="green"
            />
            <MetricCard
              icon={TrendingUp}
              label="Converted"
              value={analytics.leads.converted}
              color="blue"
            />
            <MetricCard
              icon={MessageSquare}
              label="Avg Response"
              value={`${analytics.responseTime.average}m`}
              color="orange"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Sources */}
            {sources.length > 0 && (
              <ChartCard title="Lead Sources Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sources}
                      dataKey="leads"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ source, leads }) => `${source}: ${leads}`}
                    >
                      {sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} leads`} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Conversion Funnel */}
            {funnel.length > 0 && (
              <ChartCard title="Conversion Funnel">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnel}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="status" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}
          </div>

          {/* Communication Stats */}
          {analytics.communications.length > 0 && (
            <ChartCard title="Communication Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analytics.communications.map(comm => (
                  <div
                    key={comm.type}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-bold text-gray-900 capitalize text-lg">{comm.type}</p>
                      <div className="bg-purple-100 rounded-lg p-2">
                        <MessageSquare className="text-purple-600" size={20} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Sent</p>
                        <span className="font-bold text-gray-900 text-lg">{comm.sent}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full"
                          style={{
                            width: `${(comm.delivered / comm.sent) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Delivered</p>
                        <span className="font-bold text-green-600">
                          {comm.delivered} ({Math.round((comm.delivered / comm.sent) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}
        </>
      ) : null}
    </div>
  );
}
