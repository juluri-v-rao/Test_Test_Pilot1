import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const colors = ['#2563eb', '#14b8a6', '#f97316', '#8b5cf6', '#ef4444', '#22c55e'];

function tooltipStyle() {
  return {
    borderRadius: 8,
    border: '1px solid rgba(148,163,184,.24)',
    boxShadow: '0 18px 50px rgba(15,23,42,.14)'
  };
}

export function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="completionFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.32} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle()} />
        <Area type="monotone" dataKey="completion" stroke="#2563eb" strokeWidth={3} fill="url(#completionFill)" />
        <Line type="monotone" dataKey="readiness" stroke="#14b8a6" strokeWidth={3} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RiskChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle()} />
        <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryPie({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle()} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ModuleBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="category" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle()} />
        <Bar dataKey="completion" radius={[8, 8, 0, 0]} fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TeamComparisonChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" width={112} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle()} />
        <Bar dataKey="progress" radius={[0, 8, 8, 0]} fill="#14b8a6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
