import { Response, NextFunction } from 'express';
import Election from '../models/Election';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc   Create a new election
// @route  POST /api/v1/elections
// @access Admin
export const createElection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, startDate, endDate, candidates } = req.body;

    if (new Date(endDate) <= new Date(startDate)) {
      res.status(400);
      throw new Error('End date must be after start date');
    }

    const election = await Election.create({
      title,
      description,
      startDate: new Date(startDate),
      endDate:   new Date(endDate),
      candidates: candidates ?? [],
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: election });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all elections
// @route  GET /api/v1/elections
// @access Public
export const getAllElections = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const elections = await Election.find(filter)
      .populate('createdBy', 'fullName email')
      .sort('-createdAt');

    res.json({ success: true, count: elections.length, data: elections });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single election by ID
// @route  GET /api/v1/elections/:id
// @access Public
export const getElectionById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const election = await Election.findById(req.params.id).populate('createdBy', 'fullName email');
    if (!election) {
      res.status(404);
      throw new Error('Election not found');
    }
    res.json({ success: true, data: election });
  } catch (error) {
    next(error);
  }
};

// @desc   Update election details
// @route  PUT /api/v1/elections/:id
// @access Admin
export const updateElection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let election = await Election.findById(req.params.id);
    if (!election) {
      res.status(404);
      throw new Error('Election not found');
    }

    if (election.status === 'active' || election.status === 'ended') {
      res.status(400);
      throw new Error(`Cannot update an election that is already ${election.status}`);
    }

    election = await Election.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });

    res.json({ success: true, data: election });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete election
// @route  DELETE /api/v1/elections/:id
// @access Admin
export const deleteElection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      res.status(404);
      throw new Error('Election not found');
    }

    if (election.status === 'active') {
      res.status(400);
      throw new Error('Cannot delete an active election. End it first.');
    }

    await election.deleteOne();
    res.json({ success: true, message: 'Election removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc   Start an election (draft -> active)
// @route  PATCH /api/v1/elections/:id/start
// @access Admin
export const startElection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      res.status(404); throw new Error('Election not found');
    }
    if (election.status !== 'draft') {
      res.status(400); throw new Error(`Election is already ${election.status}`);
    }
    if (election.candidates.length < 2) {
      res.status(400); throw new Error('Election needs at least 2 candidates before it can start');
    }

    election.status = 'active';
    election.startDate = new Date();
    await election.save();

    res.json({ success: true, message: 'Election started successfully', data: election });
  } catch (error) {
    next(error);
  }
};

// @desc   End an election (active -> ended)
// @route  PATCH /api/v1/elections/:id/end
// @access Admin
export const endElection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      res.status(404); throw new Error('Election not found');
    }
    if (election.status !== 'active') {
      res.status(400); throw new Error('Only active elections can be ended');
    }

    election.status = 'ended';
    election.endDate = new Date();
    await election.save();

    res.json({ success: true, message: 'Election ended successfully', data: election });
  } catch (error) {
    next(error);
  }
};

// @desc   Add a candidate to an election
// @route  POST /api/v1/elections/:id/candidates
// @access Admin
export const addCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      res.status(404); throw new Error('Election not found');
    }
    if (election.status !== 'draft') {
      res.status(400); throw new Error('Candidates can only be added to draft elections');
    }

    election.candidates.push(req.body);
    await election.save();

    res.status(201).json({ success: true, data: election });
  } catch (error) {
    next(error);
  }
};
