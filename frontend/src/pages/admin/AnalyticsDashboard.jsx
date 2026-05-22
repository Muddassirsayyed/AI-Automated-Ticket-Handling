import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { TicketTrendChart, CategoryBarChart, PriorityPieChart, SentimentChart } from '../../components/charts/Charts';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets/analytics/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout title="Analytics"><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></DashboardLayout>;

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <DashboardLayout title="Analytics Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Resolution Rate', value: `${resolutionRate}%`, icon: '✅', color: 'text-green-400' },
          { label: 'Open Tickets', value: stats.open, icon: '🔵', color: 'text-blue-400' },
          { label: 'Total Tickets', value: stats.total, icon: '🎫', color: 'text-white' },
          { label: 'Resolved', value: stats.resolved, icon: '🟢', color: 'text-green-400' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass-card text-center">
            <span className="text-3xl">{icon}</span>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
            <p className="text-slate-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">📈 Ticket Volume Trend</h3>
          <TicketTrendChart data={stats.last7Days} />
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">🏷️ Category Breakdown</h3>
          <CategoryBarChart data={stats.byCategory} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">⚡ Priority Distribution</h3>
          <PriorityPieChart data={stats.byPriority} />
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">😊 Customer Sentiment</h3>
          <SentimentChart data={stats.bySentiment} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
