// src/services/auth/sendOtpService.js
import User from "../../models/user.js";
import sendEmail from "../../utils/sendEmail.js";

const sendOtpService = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  let user = await User.findOne({ where: { email } });

  if (!user) {
    user = await User.create({
      email,
      otp,
      otp_expires_at: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
      password_hash: "",
      name: "",
    });
  } else {
    user.otp = otp;
    user.otp_expires_at = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
  }

  await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
  return { email, message: "OTP sent to email" };
};

export default sendOtpService;
