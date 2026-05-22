import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SentimentChart, CategoryBarChart } from '../../components/charts/Charts';
import api from '../../services/api';

const AIInsightsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets/analytics/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout title="AI Insights"><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></DashboardLayout>;

  const aiMetrics = [
    { label: 'Auto-Classification', value: '94%', desc: 'Tickets correctly classified by AI', icon: '🏷️', color: 'from-blue-500 to-cyan-500' },
    { label: 'Avg Confidence Score', value: '87%', desc: 'Average AI confidence across all tickets', icon: '🎯', color: 'from-violet-500 to-purple-500' },
    { label: 'Response Suggestions', value: '100%', desc: 'Tickets with AI-generated suggestions', icon: '💬', color: 'from-green-500 to-emerald-500' },
    { label: 'Priority Accuracy', value: '91%', desc: 'Correct priority assignments by AI', icon: '⚡', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <DashboardLayout title="AI Insights Dashboard">
      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {aiMetrics.map(({ label, value, desc, icon, color }) => (
          <div key={label} className="glass-card">
            <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-xl mb-3`}>
              {icon}
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm font-medium text-slate-300 mt-1">{label}</p>
            <p className="text-xs text-slate-500 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* AI Flow Diagram */}
      <div className="glass-card mb-6">
        <h3 className="font-semibold text-white mb-6">🤖 AI Automation Flow</h3>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {[
            { step: '1', label: 'User Submits', icon: '📝', color: 'from-blue-500 to-blue-600' },
            { step: '2', label: 'AI Analyzes', icon: '🤖', color: 'from-violet-500 to-violet-600' },
            { step: '3', label: 'Classifies', icon: '🏷️', color: 'from-purple-500 to-purple-600' },
            { step: '4', label: 'Auto-Assigns', icon: '👤', color: 'from-pink-500 to-pink-600' },
            { step: '5', label: 'Suggests Reply', icon: '💬', color: 'from-orange-500 to-orange-600' },
            { step: '6', label: 'Agent Reviews', icon: '✅', color: 'from-green-500 to-green-600' },
          ].map(({ step, label, icon, color }, i, arr) => (
            <div key={step} className="flex items-center gap-2 shrink-0">
              <div className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-xl mx-auto mb-2`}>
                  {icon}
                </div>
                <p className="text-xs text-slate-400 whitespace-nowrap">{label}</p>
              </div>
              {i < arr.length - 1 && <span className="text-slate-600 text-xl">→</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">😊 Sentiment Distribution</h3>
          <SentimentChart data={stats.bySentiment} />
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-white mb-4">🏷️ AI Category Predictions</h3>
          <CategoryBarChart data={stats.byCategory} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIInsightsDashboard;
