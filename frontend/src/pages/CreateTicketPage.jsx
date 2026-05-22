import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Live AI preview as user types
  const handleDescriptionChange = async (val) => {
    setForm(p => ({ ...p, description: val }));
    if (val.length > 30 && form.title.length > 5) {
      setAnalyzing(true);
      try {
        const { data } = await api.post('/ai/analyze', { title: form.title, description: val });
        setAiPreview(data);
      } catch {}
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      files.forEach(f => formData.append('attachments', f));

      const { data } = await api.post('/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Ticket created successfully!');
      navigate(`/tickets/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create New Ticket">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card mb-6 bg-gradient-to-r from-blue-600/10 to-violet-600/10 border-blue-500/20">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-semibold text-white">AI-Powered Ticket Creation</h3>
                <p className="text-slate-400 text-sm">Our AI will automatically classify your ticket and suggest the best response.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card space-y-5">
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Ticket Title *</label>
                <input
                  type="text"
                  placeholder="Brief description of your issue..."
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Description *</label>
                <textarea
                  placeholder="Describe your issue in detail. The more information you provide, the better our AI can help..."
                  value={form.description}
                  onChange={e => handleDescriptionChange(e.target.value)}
                  className="input-field min-h-[150px] resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Attachments (optional)</label>
                <div
                  className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-blue-500/30 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={e => setFiles(Array.from(e.target.files))}
                  />
                  <span className="text-3xl mb-2 block">📎</span>
                  <p className="text-slate-400 text-sm">Click to upload screenshots or documents</p>
                  <p className="text-slate-500 text-xs mt-1">Max 5 files, 10MB each</p>
                </div>
                {files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {files.map((f, i) => (
                      <span key={i} className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        📄 {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Preview */}
            {(analyzing || aiPreview) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card border-violet-500/20 bg-violet-500/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🤖</span>
                  <h3 className="font-semibold text-white">AI Analysis Preview</h3>
                  {analyzing && <span className="text-xs text-violet-400 animate-pulse">Analyzing...</span>}
                </div>
                {aiPreview && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Category', value: aiPreview.category, icon: '🏷️' },
                      { label: 'Priority', value: aiPreview.priority, icon: '⚡' },
                      { label: 'Sentiment', value: aiPreview.sentiment, icon: '😊' },
                      { label: 'Confidence', value: `${aiPreview.aiConfidence}%`, icon: '🎯' },
                    ].map(({ label, value, icon }) => (
                      <div key={label} className="bg-white/5 rounded-xl p-3 text-center">
                        <span className="text-lg">{icon}</span>
                        <p className="text-xs text-slate-400 mt-1">{label}</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
                {aiPreview?.aiSuggestion && (
                  <div className="mt-4 p-3 bg-white/5 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">AI Suggested Response:</p>
                    <p className="text-sm text-slate-300">{aiPreview.aiSuggestion}</p>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
                {loading ? '🤖 AI is analyzing...' : '🚀 Submit Ticket'}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTicketPage;
