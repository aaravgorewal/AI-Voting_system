import { Users, Vote, ShieldCheck, TrendingUp, ArrowUpRight } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b'];

const areaData = [
  { name: 'Jan', votes: 400 }, { name: 'Feb', votes: 820 },
  { name: 'Mar', votes: 600 }, { name: 'Apr', votes: 1200 },
  { name: 'May', votes: 900 }, { name: 'Jun', votes: 1500 },
  { name: 'Jul', votes: 1800 },
];

const barData = [
  { name: 'National', candidates: 12 }, { name: 'State', candidates: 8 },
  { name: 'Local', candidates: 24 }, { name: 'Union', candidates: 6 },
];

const pieData = [
  { name: 'Candidate A', value: 4200 },
  { name: 'Candidate B', value: 3100 },
  { name: 'Candidate C', value: 1800 },
  { name: 'Others',      value: 900 },
];

const stats = [
  { label: 'Total Voters',    value: '12,482', change: '+8.2%',  icon: Users,      color: 'from-primary-600 to-primary-400' },
  { label: 'Active Elections', value: '4',     change: '+1',     icon: Vote,       color: 'from-cyan-600 to-cyan-400' },
  { label: 'Votes Cast',      value: '9,821',  change: '+18.5%', icon: TrendingUp, color: 'from-emerald-600 to-emerald-400' },
  { label: 'Verified Users',  value: '8,314',  change: '+5.1%',  icon: ShieldCheck, color: 'from-amber-600 to-amber-400' },
];

const customTooltipStyle = {
  backgroundColor: '#1A1F2C',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
};

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-surface border border-white/10 flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">{change} this month</span>
              </div>
            </div>
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-surface border border-white/10">
          <h2 className="text-base font-semibold text-white mb-4">Voting Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="votes" stroke="#6366f1" fill="url(#voteGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="p-5 rounded-2xl bg-surface border border-white/10">
          <h2 className="text-base font-semibold text-white mb-4">Vote Share</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" outerRadius={70} innerRadius={40} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="p-5 rounded-2xl bg-surface border border-white/10">
        <h2 className="text-base font-semibold text-white mb-4">Candidates Per Election Type</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Bar dataKey="candidates" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
