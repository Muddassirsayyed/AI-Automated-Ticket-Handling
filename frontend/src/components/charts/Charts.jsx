import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-sm">
      {label && <p className="text-slate-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export const TicketTrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
      <XAxis dataKey="_id" stroke="#64748b" tick={{ fontSize: 11 }} />
      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey="count" name="Tickets" stroke="#3b82f6" fill="url(#colorTickets)" strokeWidth={2} />
    </AreaChart>
  </ResponsiveContainer>
);

export const CategoryBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={data} layout="vertical">
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
      <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
      <YAxis dataKey="_id" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={100} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="count" name="Count" radius={[0, 6, 6, 0]}>
        {data?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export const PriorityPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <PieChart>
      <Pie data={data} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={70} label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}>
        {data?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  </ResponsiveContainer>
);

export const SentimentChart = ({ data }) => {
  const sentimentColors = { Positive: '#10b981', Neutral: '#64748b', Negative: '#f59e0b', Frustrated: '#ef4444' };
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis dataKey="_id" stroke="#64748b" tick={{ fontSize: 11 }} />
        <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
          {data?.map((entry, i) => <Cell key={i} fill={sentimentColors[entry._id] || COLORS[i]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
