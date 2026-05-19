import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Wifi, WifiOff, Users, TrendingUp } from 'lucide-react';
import { useElectionSocket } from '../../hooks/useElectionSocket';
import api from '../../services/api';

interface Candidate {
  candidateId: string;
  name: string;
  party: string;
  voteCount: number;
}

interface ElectionData {
  title: string;
  status: string;
  totalVotes: number;
  candidates: Candidate[];
}

const COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#ec4899'];

export default function LiveResults() {
  const { id } = useParams<{ id: string }>();
  const { liveData, isConnected } = useElectionSocket(id ?? null);
  const [election, setElection] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial election data
  useEffect(() => {
    if (!id) return;
    api.get(`/elections/${id}`)
      .then(({ data }) => {
        const e = data.data;
        setElection({
          title:      e.title,
          status:     e.status,
          totalVotes: e.totalVotes,
          candidates: e.candidates.map((c: any) => ({
            candidateId: c._id,
            name:        c.name,
            party:       c.party,
            voteCount:   c.voteCount,
          })),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Override with real-time socket data when available
  const displayData = liveData
    ? { ...election, totalVotes: liveData.totalVotes, candidates: liveData.candidates }
    : election;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Election not found.
      </div>
    );
  }

  const sortedCandidates = [...(displayData.candidates ?? [])]
    .sort((a, b) => b.voteCount - a.voteCount);

  const leader = sortedCandidates[0];

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{displayData.title}</h1>
          <p className="text-gray-400 mt-1 text-sm capitalize">Status: {displayData.status}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
          isConnected
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }`}>
          {isConnected
            ? <><Wifi className="w-4 h-4" /> Live</>
            : <><WifiOff className="w-4 h-4" /> Offline</>
          }
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-white/10 text-center">
          <Users className="w-5 h-5 text-primary-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{displayData.totalVotes?.toLocaleString() ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">Total Votes</p>
        </div>
        <div className="p-5 rounded-2xl bg-surface border border-white/10 text-center">
          <TrendingUp className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white truncate">{leader?.name ?? '—'}</p>
          <p className="text-xs text-gray-400 mt-1">Leading Candidate</p>
        </div>
        <div className="p-5 rounded-2xl bg-surface border border-white/10 text-center col-span-2 sm:col-span-1">
          <p className="text-2xl font-bold text-white">{sortedCandidates.length}</p>
          <p className="text-xs text-gray-400 mt-1">Candidates</p>
        </div>
      </div>

      {/* Live Candidate Bars */}
      <div className="p-6 rounded-2xl bg-surface border border-white/10 space-y-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          {isConnected && <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" />}
          Live Vote Count
        </h2>

        {sortedCandidates.map((candidate, idx) => {
          const pct = displayData.totalVotes && displayData.totalVotes > 0
            ? (candidate.voteCount / displayData.totalVotes) * 100
            : 0;
          const color = COLORS[idx % COLORS.length];

          return (
            <div key={candidate.candidateId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                    style={{ background: color + '33', color }}>
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{candidate.name}</p>
                    <p className="text-xs text-gray-500">{candidate.party}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{candidate.voteCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{pct.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
