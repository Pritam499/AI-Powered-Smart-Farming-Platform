// src/routes/auth/sendOtp.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import generateResponse from '../../utils/generateResponse.js';
import sendOtpController from '../../controllers/auth/sendOtpController.js';

const router = express.Router();

router.post(
  '/send-otp',
  [ body('email').isEmail().withMessage('Valid email is required') ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(generateResponse(false, {}, 'Validation failed', { errors: errors.array() }));
    }
    next();
  },
  sendOtpController
);

export default router;