import { Server, Socket } from 'socket.io';
import http from 'http';

let io: Server;

export const initSocket = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Client joins a specific election room for targeted updates
    socket.on('join_election', (electionId: string) => {
      socket.join(`election:${electionId}`);
      console.log(`[Socket] ${socket.id} joined election:${electionId}`);
    });

    socket.on('leave_election', (electionId: string) => {
      socket.leave(`election:${electionId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Emit a vote update to all clients watching a specific election room
export const emitVoteUpdate = (electionId: string, payload: object) => {
  if (io) {
    io.to(`election:${electionId}`).emit('vote_update', payload);
  }
};

// Emit election status changes (started/ended) to all connected clients
export const emitElectionStatusChange = (electionId: string, status: string) => {
  if (io) {
    io.to(`election:${electionId}`).emit('election_status_changed', { electionId, status });
  }
};

export const getIO = () => io;
