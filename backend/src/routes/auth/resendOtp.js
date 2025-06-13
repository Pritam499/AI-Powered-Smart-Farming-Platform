import express from 'express';
import { body, validationResult } from 'express-validator';
import generateResponse from '../../utils/generateResponse.js';
import resendOtpController from '../../controllers/auth/resendOtpController.js';

const router = express.Router();

router.post(
  '/resend-otp',
  [ body('email').isEmail().withMessage('Valid email is required') ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(generateResponse(false, {}, 'Validation failed', { errors: errors.array() }));
    }
    next();
  },
  resendOtpController
);

export default router;