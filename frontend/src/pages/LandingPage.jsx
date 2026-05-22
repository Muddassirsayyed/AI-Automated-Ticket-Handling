import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: '🤖', title: 'AI-Powered Classification', desc: 'Automatically categorize and prioritize tickets using advanced AI' },
  { icon: '⚡', title: 'Instant Response Suggestions', desc: 'AI generates smart response suggestions for faster resolution' },
  { icon: '📊', title: 'Real-time Analytics', desc: 'Comprehensive dashboards with live ticket metrics and insights' },
  { icon: '🔐', title: 'Role-Based Access', desc: 'Secure access control for users, agents, and administrators' },
  { icon: '💬', title: 'Live Chat Support', desc: 'Built-in AI chatbot for instant customer assistance' },
  { icon: '📈', title: 'Sentiment Analysis', desc: 'Understand customer emotions to prioritize critical issues' },
];

const LandingPage = () => (
  <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
    {/* Background gradient */}
    <div className="fixed inset-0 bg-gradient-radial from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

    {/* Navbar */}
    <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">🎯</div>
        <span className="text-xl font-bold">TicketAI</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm">Sign In</Link>
        <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="relative z-10 text-center py-24 px-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
          🚀 AI-Powered Support Platform
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-violet-400 bg-clip-text text-transparent leading-tight">
          Automate Your<br />Support Tickets
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Let AI handle ticket classification, priority detection, and response suggestions.
          Resolve issues faster with intelligent automation.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/register" className="btn-primary text-base px-8 py-3">Start Free Trial</Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3">View Demo</Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-12 mt-16 flex-wrap"
      >
        {[['98%', 'Resolution Rate'], ['3x', 'Faster Response'], ['50K+', 'Tickets Handled'], ['24/7', 'AI Support']].map(([val, label]) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{val}</p>
            <p className="text-slate-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </motion.div>
    </section>

    {/* Features */}
    <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card hover:border-blue-500/30 transition-all"
          >
            <span className="text-3xl mb-4 block">{f.icon}</span>
            <h3 className="font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="relative z-10 py-20 px-6 text-center">
      <div className="glass-card max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Support?</h2>
        <p className="text-slate-400 mb-8">Join thousands of teams using TicketAI to deliver exceptional customer support.</p>
        <Link to="/register" className="btn-primary text-base px-10 py-3">Get Started — It's Free</Link>
      </div>
    </section>

    <footer className="relative z-10 text-center py-8 text-slate-500 text-sm border-t border-white/5">
      © 2024 TicketAI. Built with ❤️ using React & Node.js
    </footer>
  </div>
);

export default LandingPage;
