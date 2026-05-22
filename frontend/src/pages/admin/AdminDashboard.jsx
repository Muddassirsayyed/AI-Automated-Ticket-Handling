import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { TicketTrendChart, CategoryBarChart, PriorityPieChart, SentimentChart } from '../../components/charts/Charts';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const StatCard = ({ icon, label, value, sub, color = 'text-white' }) => (
  <motion.div whileHover={{ y: -2 }} className="glass-card">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
    </div>
    <p className="text-slate-400 text-sm">{label}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets/analytics/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout title="Admin Dashboard"><div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading analytics..." /></div></DashboardLayout>;

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🎫" label="Total Tickets" value={stats.total} />
        <StatCard icon="🔵" label="Open Tickets" value={stats.open} color="text-blue-400" />
        <StatCard icon="🟣" label="In Progress" value={stats.inProgress} color="text-violet-400" />
        <StatCard icon="🟢" label="Resolved" value={stats.resolved} color="text-green-400" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">📈 Ticket Trend (Last 7 Days)</h3>
          <TicketTrendChart data={stats.last7Days} />
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">🏷️ Tickets by Category</h3>
          <CategoryBarChart data={stats.byCategory} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">⚡ Priority Distribution</h3>
          <PriorityPieChart data={stats.byPriority} />
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">😊 Sentiment Analysis</h3>
          <SentimentChart data={stats.bySentiment} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
