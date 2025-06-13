// src/routes/auth/verifyOtp.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import verifyOtpController from '../../controllers/auth/verifyOtpController.js';
import generateResponse from '../../utils/generateResponse.js';

const router = express.Router();

router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).matches(/^\d+$/).withMessage('OTP must be numeric')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(generateResponse(false, {}, 'Validation failed', { errors: errors.array() }));
    }
    next();
  },
  verifyOtpController
);

export default router;