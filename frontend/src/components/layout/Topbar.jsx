import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ title }) => {
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        {/* Notification Bell */}
        <button className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors relative">
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {/* Avatar */}
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center font-bold text-sm">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
