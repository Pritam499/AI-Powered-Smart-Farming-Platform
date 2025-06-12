// backend/src/controllers/auth/resendOtpController.js
import generateResponse from '../../utils/generateResponse.js';
import * as authService from '../../services/authService.js';

export async function resendOtpController(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.resendOtp(email);
    return res.json(generateResponse(true, null, result));
  } catch (err) {
    next(err);
  }
}