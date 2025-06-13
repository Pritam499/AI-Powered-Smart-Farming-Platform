// src/services/auth/verifyOtpService.js
import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyOtpService = async ({ email, otp }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  if (user.otp !== otp) throw new Error("Invalid OTP");

  user.isVerified = true;
  user.otp = null;
  user.otp_expires_at = null;
  await user.save();

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, isVerified: true },
  };
};

export default verifyOtpService;
