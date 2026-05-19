import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({ fullName, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: user.getSignedJwtToken()
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Use select('+password') because password has select: false in the model
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: user.getSignedJwtToken()
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

import { extractFaceEncoding } from '../services/aiService';

export const registerFace = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Face image is required.');
    }

    const encoding = await extractFaceEncoding(req.file.buffer, req.file.originalname);
    
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found.');
    }

    user.faceEncoding = encoding;
    user.faceRecognitionImage = req.file.originalname;
    user.isVerified = true; 
    await user.save();

    res.json({
      success: true,
      message: 'Face registered successfully.',
    });
  } catch (error) {
    next(error);
  }
};
