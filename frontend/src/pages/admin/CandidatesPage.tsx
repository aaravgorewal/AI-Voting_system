import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const candidates = [
  { id: 1, name: 'Sarah Johnson',  party: 'Progressive Alliance', election: 'National Assembly 2026', votes: 4200 },
  { id: 2, name: 'Michael Chen',   party: 'Reform Coalition',     election: 'National Assembly 2026', votes: 3100 },
  { id: 3, name: 'Emily Roberts',  party: 'Unity Front',          election: 'State Council Vote',     votes: 1800 },
  { id: 4, name: 'David Okafor',   party: 'Green Future',         election: 'Local Union Election',   votes: 920  },
];

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const filtered = candidates.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Candidates</h1>
          <p className="text-gray-400 text-sm mt-1">Add and manage election candidates.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Candidate
        </button>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search candidates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-white/10 focus:border-primary-500 outline-none text-sm text-white placeholder:text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="p-5 rounded-2xl bg-surface border border-white/10 hover:border-primary-500/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-300 font-bold text-sm">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.party}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-md text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">{c.election}</p>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Votes</span>
                  <span className="text-white font-medium">{c.votes.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" style={{ width: `${(c.votes / 5000) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
