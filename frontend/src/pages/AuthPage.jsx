import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ mode = 'login' }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let user;
      if (isLogin) {
        user = await login(form.email, form.password);
      } else {
        user = await register(form.name, form.email, form.password);
      }
      // Redirect based on role
      const routes = { admin: '/admin', agent: '/agent', user: '/dashboard' };
      navigate(routes[user.role] || '/dashboard');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-radial from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center text-2xl">🎯</div>
            <span className="text-2xl font-bold text-white">TicketAI</span>
          </Link>
          <p className="text-slate-400 mt-2">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        <div className="glass-card">
          <h2 className="text-xl font-bold text-white mb-6">{isLogin ? 'Sign In' : 'Get Started'}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input-field"
                required
                minLength={6}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link to={isLogin ? '/register' : '/login'} className="text-blue-400 hover:text-blue-300 font-medium">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Link>
          </p>

          {/* Demo credentials */}
          {isLogin && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-xs text-blue-400 font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-slate-400">Admin: admin@demo.com / password123</p>
              <p className="text-xs text-slate-400">Agent: agent@demo.com / password123</p>
              <p className="text-xs text-slate-400">User: user@demo.com / password123</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
