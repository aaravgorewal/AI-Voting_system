import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string({
      required_error: 'Full name is required'
    }).min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    
    email: z.string({
      required_error: 'Email is required'
    }).email('Invalid email address'),
    
    password: z.string({
      required_error: 'Password is required'
    }).min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required'
    }).email('Invalid email address'),
    
    password: z.string({
      required_error: 'Password is required'
    })
  })
});
