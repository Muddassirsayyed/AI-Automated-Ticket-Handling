import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { priorityColors, statusColors, sentimentColors, categoryIcons, formatDate } from '../utils/helpers';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [agents, setAgents] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api.get(`/tickets/${id}`),
      api.get(`/messages/${id}`),
      user.role === 'admin' ? api.get('/admin/agents') : Promise.resolve({ data: [] })
    ]).then(([t, m, a]) => {
      setTicket(t.data);
      setMessages(m.data);
      setAgents(a.data);
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/messages/${id}`, { text: newMsg });
      setMessages(p => [...p, data]);
      setNewMsg('');
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const { data } = await api.put(`/tickets/${id}`, { status });
      setTicket(data);
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const assignAgent = async (agentId) => {
    try {
      const { data } = await api.put(`/tickets/${id}`, { assignedTo: agentId });
      setTicket(data);
      toast.success('Agent assigned');
    } catch {
      toast.error('Failed to assign agent');
    }
  };

  const useAiSuggestion = () => {
    if (ticket?.aiSuggestion) setNewMsg(ticket.aiSuggestion);
  };

  if (loading) return <DashboardLayout title="Ticket Details"><div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading ticket..." /></div></DashboardLayout>;
  if (!ticket) return <DashboardLayout title="Ticket Details"><div className="text-center py-20 text-slate-400">Ticket not found</div></DashboardLayout>;

  return (
    <DashboardLayout title="Ticket Details">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Ticket Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{categoryIcons[ticket.category]}</span>
                <h2 className="text-xl font-bold text-white">{ticket.title}</h2>
              </div>
              <div className="flex gap-2 shrink-0">
                <span className={`badge ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                <span className={`badge ${statusColors[ticket.status]}`}>{ticket.status}</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm">{ticket.description}</p>
            <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
              <span>Created by: {ticket.createdBy?.name}</span>
              <span>•</span>
              <span>{formatDate(ticket.createdAt)}</span>
              {ticket.assignedTo && <><span>•</span><span>Assigned to: {ticket.assignedTo.name}</span></>}
            </div>
          </motion.div>

          {/* Messages */}
          <div className="glass-card flex-1 min-h-[400px] flex flex-col">
            <h3 className="font-semibold text-white mb-4 pb-3 border-b border-white/10">Conversation</h3>
            <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No messages yet. Start the conversation!</div>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${msg.sender._id === user._id ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{msg.sender.name}</span>
                        <span className={`badge text-xs ${msg.sender.role === 'agent' ? 'bg-violet-500/20 text-violet-400' : msg.sender.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {msg.sender.role}
                        </span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm ${
                        msg.sender._id === user._id
                          ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-tr-sm'
                          : 'bg-white/10 text-slate-200 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="mt-4 pt-4 border-t border-white/10">
              {(user.role === 'agent' || user.role === 'admin') && ticket.aiSuggestion && (
                <button type="button" onClick={useAiSuggestion} className="w-full mb-3 p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-left hover:bg-violet-500/20 transition-colors">
                  <p className="text-xs text-violet-400 mb-1">🤖 AI Suggestion (click to use)</p>
                  <p className="text-sm text-slate-300 line-clamp-2">{ticket.aiSuggestion}</p>
                </button>
              )}
              <div className="flex gap-3">
                <textarea
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type your message..."
                  className="input-field flex-1 resize-none min-h-[80px]"
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
                />
                <button type="submit" disabled={sending || !newMsg.trim()} className="btn-primary px-4 self-end disabled:opacity-50">
                  {sending ? '...' : '→'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          {/* Ticket Info */}
          <div className="glass-card">
            <h3 className="font-semibold text-white mb-4">Ticket Info</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Category', value: ticket.category },
                { label: 'Department', value: ticket.department },
                { label: 'Sentiment', value: ticket.sentiment, badge: sentimentColors[ticket.sentiment] },
              ].map(({ label, value, badge }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-slate-400">{label}</span>
                  {badge ? <span className={`badge ${badge}`}>{value}</span> : <span className="text-white">{value}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass-card border-violet-500/20 bg-violet-500/5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">🤖 AI Insights</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Confidence Score</span>
                  <span className="text-violet-400">{ticket.aiConfidence}%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full" style={{ width: `${ticket.aiConfidence}%` }} />
                </div>
              </div>
              {ticket.aiSuggestion && (
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Suggested Response:</p>
                  <p className="text-xs text-slate-300 line-clamp-4">{ticket.aiSuggestion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Update (Agent/Admin) */}
          {(user.role === 'agent' || user.role === 'admin') && (
            <div className="glass-card">
              <h3 className="font-semibold text-white mb-3">Update Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'].map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`text-xs py-2 px-3 rounded-xl border transition-all ${
                      ticket.status === s
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assign Agent (Admin) */}
          {user.role === 'admin' && agents.length > 0 && (
            <div className="glass-card">
              <h3 className="font-semibold text-white mb-3">Assign Agent</h3>
              <select
                onChange={e => assignAgent(e.target.value)}
                value={ticket.assignedTo?._id || ''}
                className="input-field text-sm"
              >
                <option value="" className="bg-slate-900">Unassigned</option>
                {agents.map(a => <option key={a._id} value={a._id} className="bg-slate-900">{a.name}</option>)}
              </select>
            </div>
          )}

          {/* Timeline */}
          {ticket.timeline?.length > 0 && (
            <div className="glass-card">
              <h3 className="font-semibold text-white mb-3">Timeline</h3>
              <div className="space-y-3">
                {ticket.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <p className="text-slate-300">{t.action}</p>
                      <p className="text-xs text-slate-500">{formatDate(t.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketDetailPage;
