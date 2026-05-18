import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Vote from '../models/Vote';
import Election from '../models/Election';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc   Cast a vote
// @route  POST /api/v1/votes/cast
// @access Private (verified voters only)
export const castVote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.user._id;

    // 1. Load the election
    const election = await Election.findById(electionId).session(session);
    if (!election) {
      await session.abortTransaction();
      res.status(404);
      throw new Error('Election not found');
    }

    // 2. Validate election is currently active
    if (election.status !== 'active') {
      await session.abortTransaction();
      res.status(400);
      throw new Error(`Voting is not open. Election status is: ${election.status}`);
    }

    // 3. Validate election window using timestamps
    const now = new Date();
    if (now < election.startDate) {
      await session.abortTransaction();
      res.status(400);
      throw new Error('Voting has not started yet');
    }
    if (now > election.endDate) {
      await session.abortTransaction();
      res.status(400);
      throw new Error('Voting period has ended');
    }

    // 4. Validate candidate exists in this election
    const candidate = election.candidates.find(
      (c) => c._id.toString() === candidateId
    );
    if (!candidate) {
      await session.abortTransaction();
      res.status(404);
      throw new Error('Candidate not found in this election');
    }

    // 5. Check for duplicate vote (double-checked at DB level by unique index)
    const existingVote = await Vote.findOne({ voter: voterId, election: electionId }).session(session);
    if (existingVote) {
      await session.abortTransaction();
      res.status(409);
      throw new Error('You have already voted in this election');
    }

    // 6. Generate a unique cryptographic receipt hash for the voter
    const receiptHash = crypto
      .createHash('sha256')
      .update(`${voterId}-${electionId}-${candidateId}-${Date.now()}`)
      .digest('hex');

    // 7. Save the vote record
    const [vote] = await Vote.create(
      [{ voter: voterId, election: electionId, candidateId, receiptHash }],
      { session }
    );

    // 8. Atomically increment the candidate's vote count and the election's total
    await Election.updateOne(
      { _id: electionId, 'candidates._id': candidateId },
      {
        $inc: {
          'candidates.$.voteCount': 1,
          totalVotes: 1,
        },
      },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Your vote has been cast successfully',
      receipt: receiptHash,
      votedAt: vote.votedAt,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    // Handle MongoDB duplicate key error from compound unique index
    if (error.code === 11000) {
      res.status(409);
      return next(new Error('You have already voted in this election'));
    }
    next(error);
  }
};

// @desc   Check if current user has voted in an election
// @route  GET /api/v1/votes/status/:electionId
// @access Private
export const checkVoteStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const vote = await Vote.findOne({
      voter: req.user._id,
      election: req.params.electionId,
    }).select('votedAt receiptHash');

    res.json({
      success: true,
      hasVoted: !!vote,
      vote: vote ?? null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get election results (candidate vote counts)
// @route  GET /api/v1/votes/results/:electionId
// @access Public (only visible after election ends)
export const getElectionResults = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const election = await Election.findById(req.params.electionId)
      .select('title status candidates totalVotes endDate');

    if (!election) {
      res.status(404);
      throw new Error('Election not found');
    }

    if (election.status === 'active') {
      res.status(403);
      throw new Error('Results are not available until the election ends');
    }

    const results = election.candidates
      .map(c => ({
        candidateId: c._id,
        name:        c.name,
        party:       c.party,
        voteCount:   c.voteCount,
        percentage:  election.totalVotes > 0
          ? ((c.voteCount / election.totalVotes) * 100).toFixed(2)
          : '0.00',
      }))
      .sort((a, b) => b.voteCount - a.voteCount);

    res.json({
      success: true,
      data: {
        electionTitle: election.title,
        totalVotes:    election.totalVotes,
        status:        election.status,
        endDate:       election.endDate,
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get voting history for logged-in user
// @route  GET /api/v1/votes/my-history
// @access Private
export const getMyVotingHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const votes = await Vote.find({ voter: req.user._id })
      .populate('election', 'title status endDate')
      .select('election receiptHash votedAt')
      .sort('-votedAt');

    res.json({ success: true, count: votes.length, data: votes });
  } catch (error) {
    next(error);
  }
};
