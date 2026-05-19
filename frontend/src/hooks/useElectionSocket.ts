import { useEffect, useState } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '../services/socket';

interface Candidate {
  candidateId: string;
  name: string;
  party: string;
  voteCount: number;
}

interface VoteUpdate {
  electionId: string;
  totalVotes: number;
  candidates: Candidate[];
}

export const useElectionSocket = (electionId: string | null) => {
  const [liveData, setLiveData] = useState<VoteUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!electionId) return;

    const socket = getSocket();

    connectSocket();

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('join_election', electionId);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onVoteUpdate = (payload: VoteUpdate) => {
      setLiveData(payload);
    };

    const onStatusChange = (payload: { electionId: string; status: string }) => {
      console.log(`Election ${payload.electionId} status changed to: ${payload.status}`);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('vote_update', onVoteUpdate);
    socket.on('election_status_changed', onStatusChange);

    // If already connected when hook mounts, join immediately
    if (socket.connected) {
      setIsConnected(true);
      socket.emit('join_election', electionId);
    }

    return () => {
      socket.emit('leave_election', electionId);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('vote_update', onVoteUpdate);
      socket.off('election_status_changed', onStatusChange);
      disconnectSocket();
    };
  }, [electionId]);

  return { liveData, isConnected };
};
