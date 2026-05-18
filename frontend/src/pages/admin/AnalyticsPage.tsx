import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const tooltipStyle = {
  backgroundColor: '#1A1F2C',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
};

const dailyVotes = [
  { day: 'Mon', votes: 320, fraud: 4 }, { day: 'Tue', votes: 580, fraud: 2 },
  { day: 'Wed', votes: 460, fraud: 7 }, { day: 'Thu', votes: 720, fraud: 1 },
  { day: 'Fri', votes: 890, fraud: 3 }, { day: 'Sat', votes: 540, fraud: 5 },
  { day: 'Sun', votes: 310, fraud: 2 },
];

const registrationsData = [
  { month: 'Jan', registrations: 340 }, { month: 'Feb', registrations: 520 },
  { month: 'Mar', registrations: 410 }, { month: 'Apr', registrations: 780 },
  { month: 'May', registrations: 630 }, { month: 'Jun', registrations: 910 },
];

const verificationData = [
  { month: 'Jan', verified: 280, unverified: 60 }, { month: 'Feb', verified: 430, unverified: 90 },
  { month: 'Mar', verified: 360, unverified: 50 }, { month: 'Apr', verified: 680, unverified: 100 },
  { month: 'May', verified: 510, unverified: 120 }, { month: 'Jun', verified: 820, unverified: 90 },
];

const kpiCards = [
  { label: 'Avg. Daily Votes',     value: '546',    sub: 'Last 7 days', color: 'text-primary-400' },
  { label: 'Fraud Attempts',       value: '24',     sub: 'This month',  color: 'text-red-400' },
  { label: 'Verification Rate',    value: '87.3%',  sub: 'All time',    color: 'text-emerald-400' },
  { label: 'Voter Turnout',        value: '62.5%',  sub: 'Active elections', color: 'text-cyan-400' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Deep insights into voting patterns and system health.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, sub, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-surface border border-white/10 text-center">
            <p className={`text-3xl font-bold mb-1 ${color}`}>{value}</p>
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Daily Votes vs Fraud Attempts */}
      <div className="p-5 rounded-2xl bg-surface border border-white/10">
        <h2 className="text-base font-semibold text-white mb-4">Daily Votes vs Fraud Attempts</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dailyVotes}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
            <Line type="monotone" dataKey="votes" stroke="#6366f1" strokeWidth={2} dot={false} name="Votes" />
            <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} dot={false} name="Fraud Attempts" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Registrations */}
        <div className="p-5 rounded-2xl bg-surface border border-white/10">
          <h2 className="text-base font-semibold text-white mb-4">Monthly Registrations</h2>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={registrationsData}>
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="registrations" stroke="#22d3ee" fill="url(#regGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Verified vs Unverified */}
        <div className="p-5 rounded-2xl bg-surface border border-white/10">
          <h2 className="text-base font-semibold text-white mb-4">Verified vs Unverified Voters</h2>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={verificationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
              <Bar dataKey="verified" fill="#6366f1" radius={[4, 4, 0, 0]} name="Verified" />
              <Bar dataKey="unverified" fill="#374151" radius={[4, 4, 0, 0]} name="Unverified" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
