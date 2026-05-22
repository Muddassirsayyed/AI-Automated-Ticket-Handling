import { priorityColors, statusColors, categoryIcons } from '../../utils/helpers';
import { timeAgo } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/tickets/${ticket._id}`)}
      className="glass-card cursor-pointer hover:border-blue-500/30 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryIcons[ticket.category] || '🎫'}</span>
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {ticket.title}
          </h3>
        </div>
        <span className={`badge ${priorityColors[ticket.priority]} shrink-0`}>{ticket.priority}</span>
      </div>

      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{ticket.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <span className={`badge ${statusColors[ticket.status]}`}>{ticket.status}</span>
          <span className="badge bg-slate-700/50 text-slate-300">{ticket.category}</span>
        </div>
        <span className="text-xs text-slate-500">{timeAgo(ticket.createdAt)}</span>
      </div>

      {ticket.aiConfidence > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
          <span className="text-xs text-slate-500">AI Confidence</span>
          <div className="flex-1 bg-slate-700 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-violet-500 h-1.5 rounded-full"
              style={{ width: `${ticket.aiConfidence}%` }}
            />
          </div>
          <span className="text-xs text-blue-400">{ticket.aiConfidence}%</span>
        </div>
      )}
    </motion.div>
  );
};

export default TicketCard;
