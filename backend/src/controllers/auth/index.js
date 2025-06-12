// backend/src/controllers/auth/index.js

import { sendOtpController } from './sendOtpController.js';
import { verifyOtpController } from './verifyOtpController.js';
import { resendOtpController } from './resendOtpController.js';
import { signupController } from './signupController.js';

export {
  sendOtpController,
  verifyOtpController,
  resendOtpController,
  signupController,
};
