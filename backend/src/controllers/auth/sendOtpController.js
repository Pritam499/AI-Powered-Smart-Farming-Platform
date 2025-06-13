// src/controllers/auth/sendOtpController.js
import sendOtpService from '../../services/auth/sendOtpService.js';
import generateResponse from '../../utils/generateResponse.js';

const sendOtpController = async (req, res) => {
  try {
    const result = await sendOtpService(req.body.email);
    res.status(200).json(generateResponse(true, result, 'OTP sent successfully.'));
  } catch (error) {
    res.status(400).json(generateResponse(false, {}, 'OTP sending failed', error.message));
  }
};

export default sendOtpController;