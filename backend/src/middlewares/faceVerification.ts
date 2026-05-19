import { Response, NextFunction } from 'express';
import multer from 'multer';
import { AuthRequest } from './authMiddleware';
import User from '../models/User';
import { verifyFaceWithAI } from '../services/aiService';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export const requireFaceVerification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      res.status(400);
      throw new Error('Face image is required for verification before voting.');
    }

    // Retrieve user with face encoding
    const user = await User.findById(req.user._id).select('+faceEncoding');
    
    if (!user) {
      res.status(404);
      throw new Error('User not found.');
    }

    if (!user.faceEncoding || user.faceEncoding.length === 0) {
      res.status(400);
      throw new Error('User has no registered face encoding. Please register your face first.');
    }

    // Contact AI service for verification
    const verificationResult = await verifyFaceWithAI(
      req.file.buffer,
      req.file.originalname || 'live_image.jpg',
      user.faceEncoding
    );

    if (!verificationResult.data.match) {
      res.status(403);
      throw new Error(`Face verification failed. Confidence too low (${verificationResult.data.confidence_percentage}%).`);
    }

    // If match, attach verification result to request and proceed
    req.faceVerification = verificationResult.data;
    next();
  } catch (error: any) {
    next(error);
  }
};
