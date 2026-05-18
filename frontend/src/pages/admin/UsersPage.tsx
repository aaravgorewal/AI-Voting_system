import { useState } from 'react';
import { Search, ShieldCheck, ShieldX } from 'lucide-react';

const users = [
  { id: 1, name: 'Jane Doe',    email: 'jane@example.com',    role: 'user',  verified: true,  joined: '2026-01-15' },
  { id: 2, name: 'John Smith',  email: 'john@example.com',    role: 'admin', verified: true,  joined: '2026-02-10' },
  { id: 3, name: 'Priya Singh', email: 'priya@example.com',   role: 'user',  verified: false, joined: '2026-04-22' },
  { id: 4, name: 'Ahmed Khan',  email: 'ahmed@example.com',   role: 'user',  verified: true,  joined: '2026-03-05' },
  { id: 5, name: 'Lisa Chen',   email: 'lisa@example.com',    role: 'user',  verified: false, joined: '2026-05-01' },
];

const roleColors: Record<string, string> = {
  user:       'bg-gray-500/10 text-gray-400 border-gray-500/20',
  admin:      'bg-primary-500/10 text-primary-400 border-primary-500/20',
  superadmin: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 text-sm mt-1">Review and manage all registered voters.</p>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-white/10 focus:border-primary-500 outline-none text-sm text-white placeholder:text-gray-600"
        />
      </div>

      <div className="rounded-2xl bg-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Verified</th>
                <th className="text-left px-5 py-3 font-medium">Joined</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-300 font-bold text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {user.verified ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                        <ShieldCheck className="w-4 h-4" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                        <ShieldX className="w-4 h-4" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-400">{user.joined}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 text-xs font-medium rounded-md bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors border border-primary-500/20">
                        Manage
                      </button>
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
