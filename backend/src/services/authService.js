// backend/src/services/authService.js
import jwt from 'jsonwebtoken';
import { generateOtp, sendOtpEmail } from '../utils/otpService.js';
import User from '../models/user.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/index.js';

export async function sendOtp(email) {
  const otp = generateOtp();
  // Upsert user & store OTP
  await User.upsert({ email, otp, isVerified: false }, { returning: true });

  // Send via email
  await sendOtpEmail(email, otp);
  return 'OTP sent to your email';
}

export async function verifyOtp(email, otp) {
  const user = await User.findOne({ where: { email } });
  if (!user || user.otp !== otp) {
    throw new Error('Invalid OTP');
  }
  // mark verified & clear OTP
  user.isVerified = true;
  user.otp = null;
  await user.save();

  // Issue JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return token;
}

export async function resendOtp(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Email not found');
  const otp = generateOtp();
  user.otp = otp;
  user.isVerified = false;
  await user.save();
  await sendOtpEmail(email, otp);
  return 'OTP resent to your email';
}

export async function signup(email, name) {
  // For MVP, just update the user’s name
  const user = await User.findOne({ where: { email } });
  
  if (!user || !user.isVerified) throw new Error('Verify OTP first');
  user.name = name;
  await user.save();
  console.log(`User ${user.id} signed up with name: ${name}`);
  return { id: user.id, email: user.email, name: user.name };
}