// backend/src/routes/authRoutes.js
import express from 'express';
import {
  sendOtpController,
  verifyOtpController,
  resendOtpController,
  signupController,
} from '../controllers/auth/index.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Request OTP (signup or login)
router.post('/send-otp', sendOtpController);

// Verify OTP -> returns JWT
router.post('/verify-otp', verifyOtpController);

// Resend OTP
router.post('/resend-otp', resendOtpController);

// (Optional) Complete signup/profile setup
router.post('/signup', authMiddleware, signupController);

export default router;
