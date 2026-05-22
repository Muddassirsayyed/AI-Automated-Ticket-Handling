import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import TicketCard from '../components/common/TicketCard';
import { TicketCardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets?limit=12').then(({ data }) => setTickets(data.tickets)).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  };

  return (
    <DashboardLayout title="Agent Dashboard">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card bg-gradient-to-r from-violet-600/20 to-blue-600/20 border-violet-500/20 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Agent Panel — {user?.name}</h2>
            <p className="text-slate-400 mt-1">Manage your assigned support tickets efficiently.</p>
          </div>
          <Link to="/my-tickets" className="btn-primary">View All Tickets</Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Assigned', value: stats.total, icon: '🎫', color: 'text-white' },
          { label: 'Open', value: stats.open, icon: '🔵', color: 'text-blue-400' },
          { label: 'In Progress', value: stats.inProgress, icon: '🟣', color: 'text-violet-400' },
          { label: 'Resolved', value: stats.resolved, icon: '🟢', color: 'text-green-400' },
        ].map(({ label, value, icon, color }) => (
          <motion.div key={label} whileHover={{ y: -2 }} className="glass-card text-center">
            <span className="text-2xl">{icon}</span>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
            <p className="text-slate-400 text-sm mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-white mb-4">Assigned Tickets</h3>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <TicketCardSkeleton key={i} />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-card text-center py-16">
          <span className="text-5xl mb-4 block">✅</span>
          <h3 className="text-lg font-semibold text-white mb-2">No tickets assigned</h3>
          <p className="text-slate-400">You're all caught up! No pending tickets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AgentDashboard;
