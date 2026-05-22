import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const navItems = {
  user: [
    { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/tickets/new', icon: '➕', label: 'New Ticket' },
    { to: '/my-tickets', icon: '🎫', label: 'My Tickets' },
  ],
  agent: [
    { to: '/agent', icon: '🏠', label: 'Dashboard' },
    { to: '/my-tickets', icon: '🎫', label: 'Assigned Tickets' },
  ],
  admin: [
    { to: '/admin', icon: '🏠', label: 'Dashboard' },
    { to: '/admin/users', icon: '👥', label: 'Users' },
    { to: '/admin/tickets', icon: '🎫', label: 'All Tickets' },
    { to: '/admin/analytics', icon: '📊', label: 'Analytics' },
    { to: '/admin/ai-insights', icon: '🤖', label: 'AI Insights' },
  ]
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = navItems[user?.role] || navItems.user;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen glass border-r border-white/10 flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center text-lg">
            🎯
          </div>
          <div>
            <h1 className="font-bold text-white">TicketAI</h1>
            <p className="text-xs text-slate-400 capitalize">{user?.role} Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin' || to === '/agent'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full btn-secondary text-sm py-2">
          Sign Out
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
