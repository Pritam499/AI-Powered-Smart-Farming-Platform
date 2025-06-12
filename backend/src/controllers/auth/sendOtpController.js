// backend/src/controllers/auth/sendOtpController.js
import generateResponse from '../../utils/generateResponse.js';
import * as authService from '../../services/authService.js';

export async function sendOtpController(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.sendOtp(email);
    return res.json(generateResponse(true, null, result));
  } catch (err) {
    next(err);
  }
}