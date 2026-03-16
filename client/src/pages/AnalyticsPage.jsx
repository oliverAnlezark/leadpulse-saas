import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your performance metrics</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading analytics...</div>
      ) : analytics ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Leads', value: analytics.leads.total },
              { label: 'Qualified', value: analytics.leads.qualified },
              { label: 'Converted', value: analytics.leads.converted },
              { label: 'Avg Response', value: `${analytics.responseTime.average}m` }
            ].map((metric, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Sources */}
            {sources.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Lead Sources</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sources}
                      dataKey="leads"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Conversion Funnel */}
            {funnel.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Conversion Funnel</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnel}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Communication Stats */}
          {analytics.communications.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Communication Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analytics.communications.map(comm => (
                  <div key={comm.type} className="border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-900 capitalize">{comm.type}</p>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600">Sent: <span className="font-semibold text-gray-900">{comm.sent}</span></p>
                      <p className="text-sm text-gray-600">Delivered: <span className="font-semibold text-gray-900">{comm.delivered}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
