import express from 'express';
import { castVote, checkVoteStatus, getElectionResults, getMyVotingHistory } from '../controllers/voteController';
import { protect } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { castVoteSchema } from '../validators/voteValidators';

import { requireFaceVerification, upload } from '../middlewares/faceVerification';

const router = express.Router();

// All vote routes require authentication
router.use(protect);

router.post(
  '/cast',
  upload.single('face_image'),
  requireFaceVerification,
  validateRequest(castVoteSchema),
  castVote
);
router.get('/my-history', getMyVotingHistory);
router.get('/status/:electionId', checkVoteStatus);

// Results are publicly readable but still run through protect (can be made public)
router.get('/results/:electionId', getElectionResults);

export default router;
