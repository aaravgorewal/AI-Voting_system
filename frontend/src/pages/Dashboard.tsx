import { CheckCircle2, Clock } from 'lucide-react';

export default function Dashboard() {
  const activeElections = [
    { id: 1, name: "National Assembly Election 2026", status: "active", endDate: "2026-06-15" },
    { id: 2, name: "Local Council Vote", status: "upcoming", endDate: "2026-07-01" },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Voter Dashboard</h1>
          <p className="text-gray-400">Welcome back! Check active elections and your voting status.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface/80 border border-white/10 rounded-lg backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-gray-300">Identity Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Available Elections</h2>
          
          {activeElections.map((election) => (
            <div key={election.id} className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-primary-500/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{election.name}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Closes on {election.endDate}
                </p>
              </div>
              
              <button className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors shadow-lg">
                Participate
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Your Voting History</h2>
          
          <div className="p-6 rounded-2xl bg-surface border border-white/10">
            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-white/10">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-white">Presidential Election 2025</h4>
                <p className="text-sm text-gray-400 mt-1">Voted on Nov 14, 2025</p>
                <div className="mt-2 inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-background text-gray-400 border border-white/5">
                  Tx: 0x8f...3a9c
                </div>
              </div>
            </div>
            
            <p className="text-sm text-center text-gray-500 mt-4">
              End of voting history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
