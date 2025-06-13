import resendOtpService from '../../services/auth/resendOtpService.js';
import generateResponse from '../../utils/generateResponse.js';

const resendOtpController = async (req, res) => {
  try {
    const result = await resendOtpService(req.body.email);
    res.status(200).json(generateResponse(true, result, 'OTP resent successfully.'));
  } catch (error) {
    res.status(400).json(generateResponse(false, {}, 'Resend OTP failed', error.message));
  }
};

export default resendOtpController;