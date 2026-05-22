import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import TicketCard from '../../components/common/TicketCard';
import { TicketCardSkeleton } from '../../components/common/Skeleton';
import api from '../../services/api';

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) });
      const { data } = await api.get(`/tickets?${params}`);
      setTickets(data.tickets);
      setTotalPages(data.pages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [filters, page]);

  return (
    <DashboardLayout title="All Tickets">
      <div className="glass-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="🔍 Search tickets..."
            value={filters.search}
            onChange={e => { setFilters(p => ({ ...p, search: e.target.value })); setPage(1); }}
            className="input-field"
          />
          {[['status', ['', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed']],
            ['priority', ['', 'Low', 'Medium', 'High', 'Critical']]].map(([key, opts]) => (
            <select key={key} value={filters[key]} onChange={e => { setFilters(p => ({ ...p, [key]: e.target.value })); setPage(1); }} className="input-field">
              {opts.map(o => <option key={o} value={o} className="bg-slate-900">{o || `All ${key}s`}</option>)}
            </select>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <TicketCardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)}
          </div>
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

export default AdminTicketsPage;
