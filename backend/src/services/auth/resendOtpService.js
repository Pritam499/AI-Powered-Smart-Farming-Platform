import User from "../../models/user.js";
import sendEmail from "../../utils/sendEmail.js";

const resendOtpService = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otp_expires_at = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
  return { email, message: "New OTP sent" };
};

export default resendOtpService;
