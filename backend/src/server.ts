import http from 'http';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import { initSocket } from './config/socket';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import electionRoutes from './routes/electionRoutes';
import voteRoutes from './routes/voteRoutes';

// Load env vars first
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Voting AI API is running...' });
});

// API Routes
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/elections', electionRoutes);
app.use('/api/v1/votes',     voteRoutes);

// Error Handling
app.use(errorHandler);

// Create http server and attach socket.io
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server + Socket.io running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
