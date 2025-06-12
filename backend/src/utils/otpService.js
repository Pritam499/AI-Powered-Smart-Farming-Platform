// src/utils/otpService.js

import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Generate a 6-digit numeric OTP
export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP email using nodemailer
export async function sendOtpEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"SmartFarm" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your SmartFarm OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    });

    console.log(`✅ Email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send OTP email:`, err);
    throw new Error('Failed to send OTP email');
  }
}