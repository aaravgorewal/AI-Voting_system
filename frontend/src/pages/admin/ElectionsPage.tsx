import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const elections = [
  { id: 1, name: 'National Assembly Election 2026', status: 'active',    candidates: 12, startDate: '2026-05-01', endDate: '2026-06-15' },
  { id: 2, name: 'State Council Vote',              status: 'upcoming',  candidates: 8,  startDate: '2026-07-01', endDate: '2026-07-15' },
  { id: 3, name: 'Local Union Election',            status: 'completed', candidates: 5,  startDate: '2026-03-10', endDate: '2026-03-20' },
  { id: 4, name: 'University Student Union',        status: 'active',    candidates: 9,  startDate: '2026-05-10', endDate: '2026-05-25' },
];

const statusColors: Record<string, string> = {
  active:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  upcoming:  'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function ElectionsPage() {
  const [search, setSearch] = useState('');
  const filtered = elections.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Elections</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and monitor all election events.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Create Election
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search elections..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-white/10 focus:border-primary-500 outline-none text-sm text-white placeholder:text-gray-600"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left px-5 py-3 font-medium">Election Name</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Candidates</th>
                <th className="text-left px-5 py-3 font-medium">Start Date</th>
                <th className="text-left px-5 py-3 font-medium">End Date</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(election => (
                <tr key={election.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4 font-medium text-white">{election.name}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[election.status]}`}>
                      {election.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300">{election.candidates}</td>
                  <td className="px-5 py-4 text-gray-400">{election.startDate}</td>
                  <td className="px-5 py-4 text-gray-400">{election.endDate}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 rounded-md text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
