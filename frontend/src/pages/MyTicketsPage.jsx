import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import TicketCard from '../components/common/TicketCard';
import { TicketCardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';

const STATUSES = ['', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
const CATEGORIES = ['', 'Technical Issue', 'Billing', 'Account Access', 'Feature Request', 'General Query'];
const PRIORITIES = ['', 'Low', 'Medium', 'High', 'Critical'];

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '', search: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) });
      const { data } = await api.get(`/tickets?${params}`);
      setTickets(data.tickets);
      setTotalPages(data.pages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [filters, page]);

  return (
    <DashboardLayout title="My Tickets">
      {/* Filters */}
      <div className="glass-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="🔍 Search tickets..."
            value={filters.search}
            onChange={e => { setFilters(p => ({ ...p, search: e.target.value })); setPage(1); }}
            className="input-field"
          />
          {[['status', STATUSES], ['category', CATEGORIES], ['priority', PRIORITIES]].map(([key, opts]) => (
            <select
              key={key}
              value={filters[key]}
              onChange={e => { setFilters(p => ({ ...p, [key]: e.target.value })); setPage(1); }}
              className="input-field capitalize"
            >
              {opts.map(o => <option key={o} value={o} className="bg-slate-900">{o || `All ${key}s`}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Tickets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <TicketCardSkeleton key={i} />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-card text-center py-16">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-lg font-semibold text-white mb-2">No tickets found</h3>
          <p className="text-slate-400">Try adjusting your filters or create a new ticket.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4 py-2 text-sm disabled:opacity-50">← Prev</button>
              <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary px-4 py-2 text-sm disabled:opacity-50">Next →</button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default MyTicketsPage;
