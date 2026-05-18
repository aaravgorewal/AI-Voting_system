import express from 'express';
import {
  createElection, getAllElections, getElectionById,
  updateElection, deleteElection, startElection, endElection, addCandidate
} from '../controllers/electionController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createElectionSchema, updateElectionSchema } from '../validators/electionValidators';

const router = express.Router();

// Public routes
router.get('/', getAllElections);
router.get('/:id', getElectionById);

// Admin-only routes
router.use(protect, authorize('admin', 'superadmin'));

router.post('/',    validateRequest(createElectionSchema), createElection);
router.put('/:id', validateRequest(updateElectionSchema), updateElection);
router.delete('/:id', deleteElection);

router.patch('/:id/start', startElection);
router.patch('/:id/end',   endElection);
router.post('/:id/candidates', addCandidate);

export default router;
