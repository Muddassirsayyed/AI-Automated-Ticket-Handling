// Priority badge colors
export const priorityColors = {
  Low: 'bg-green-500/20 text-green-400 border border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  High: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  Critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

// Status badge colors
export const statusColors = {
  Open: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'In Progress': 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
  Pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Resolved: 'bg-green-500/20 text-green-400 border border-green-500/30',
  Closed: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};

// Sentiment colors
export const sentimentColors = {
  Positive: 'bg-green-500/20 text-green-400',
  Neutral: 'bg-slate-500/20 text-slate-400',
  Negative: 'bg-orange-500/20 text-orange-400',
  Frustrated: 'bg-red-500/20 text-red-400',
};

// Category icons (emoji)
export const categoryIcons = {
  'Technical Issue': '🔧',
  'Billing': '💳',
  'Account Access': '🔐',
  'Feature Request': '✨',
  'General Query': '💬',
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};
