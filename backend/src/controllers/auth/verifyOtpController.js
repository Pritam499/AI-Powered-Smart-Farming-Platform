// backend/src/controllers/auth/verifyOtpController.js
import generateResponse from '../../utils/generateResponse.js';
import * as authService from '../../services/authService.js';

export async function verifyOtpController(req, res, next) {
  try {
    const { email, otp } = req.body;
    const token = await authService.verifyOtp(email, otp);
    return res.json(generateResponse(true, { token }, 'OTP verified'));
  } catch (err) {
    next(err);
  }
}