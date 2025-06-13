// src/controllers/auth/verifyOtpController.js
import verifyOtpService from '../../services/auth/verifyOtpService.js';
import generateResponse from '../../utils/generateResponse.js';

const verifyOtpController = async (req, res) => {
  try {
    const result = await verifyOtpService(req.body);
    res.status(200).json(generateResponse(true, result, 'OTP verified. Logged in.'));
  } catch (error) {
    res.status(400).json(generateResponse(false, {}, 'Verification failed', error.message));
  }
};

export default verifyOtpController;