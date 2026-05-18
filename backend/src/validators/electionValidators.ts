import { z } from 'zod';

export const createElectionSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' })
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title cannot exceed 100 characters'),

    description: z.string({ required_error: 'Description is required' })
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description cannot exceed 1000 characters'),

    startDate: z.string({ required_error: 'Start date is required' })
      .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid start date' }),

    endDate: z.string({ required_error: 'End date is required' })
      .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid end date' }),

    candidates: z.array(
      z.object({
        name:        z.string().min(2, 'Candidate name is required'),
        party:       z.string().min(2, 'Party name is required'),
        description: z.string().optional(),
        image:       z.string().url('Invalid image URL').optional(),
      })
    ).min(2, 'An election must have at least 2 candidates').optional(),
  })
});

export const updateElectionSchema = z.object({
  body: z.object({
    title:       z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    startDate:   z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid start date' }).optional(),
    endDate:     z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid end date' }).optional(),
  })
});
