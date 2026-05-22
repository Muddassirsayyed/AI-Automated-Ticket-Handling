import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import TicketCard from '../components/common/TicketCard';
import { TicketCardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon, label, value, color }) => (
  <motion.div whileHover={{ y: -2 }} className="glass-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </motion.div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets?limit=6').then(({ data }) => {
      setTickets(data.tickets);
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  };

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-gradient-to-r from-blue-600/20 to-violet-600/20 border-blue-500/20 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Welcome back, {user?.name}! 👋</h2>
            <p className="text-slate-400 mt-1">Here's what's happening with your support tickets.</p>
          </div>
          <Link to="/tickets/new" className="btn-primary">+ New Ticket</Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🎫" label="Total Tickets" value={stats.total} color="text-white" />
        <StatCard icon="🔵" label="Open" value={stats.open} color="text-blue-400" />
        <StatCard icon="🟣" label="In Progress" value={stats.inProgress} color="text-violet-400" />
        <StatCard icon="🟢" label="Resolved" value={stats.resolved} color="text-green-400" />
      </div>

      {/* Recent Tickets */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Tickets</h3>
        <Link to="/my-tickets" className="text-blue-400 hover:text-blue-300 text-sm">View all →</Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <TicketCardSkeleton key={i} />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-card text-center py-16">
          <span className="text-5xl mb-4 block">🎫</span>
          <h3 className="text-lg font-semibold text-white mb-2">No tickets yet</h3>
          <p className="text-slate-400 mb-6">Create your first support ticket to get started.</p>
          <Link to="/tickets/new" className="btn-primary">Create Ticket</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)}
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
