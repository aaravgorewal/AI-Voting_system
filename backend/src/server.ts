import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import electionRoutes from './routes/electionRoutes';
import voteRoutes from './routes/voteRoutes';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Voting AI API is running...');
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/elections', electionRoutes);
app.use('/api/v1/votes', voteRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
