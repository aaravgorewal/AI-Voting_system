import express from 'express';
import { registerUser, loginUser, getMe, registerFace } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../validators/authValidators';
import { protect, authorize } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/faceVerification';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);

// Protected routes (Any logged-in user)
router.get('/me', protect, getMe);
router.post('/register-face', protect, upload.single('face_image'), registerFace);

// Role-based route (Admin only)
router.get('/admin-dashboard', protect, authorize('admin', 'superadmin'), (req, res) => {
  res.json({ message: 'Welcome to the secure admin dashboard', user: (req as any).user });
});

export default router;
