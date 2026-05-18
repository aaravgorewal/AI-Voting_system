import { z } from 'zod';

export const castVoteSchema = z.object({
  body: z.object({
    electionId: z.string({ required_error: 'Election ID is required' })
      .min(1, 'Election ID cannot be empty'),

    candidateId: z.string({ required_error: 'Candidate ID is required' })
      .min(1, 'Candidate ID cannot be empty'),
  })
});
