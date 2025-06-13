// backend/src/services/authService.js
import User from '../models/user.js';


export async function signup(email, name) {
  // For MVP, just update the user’s name
  const user = await User.findOne({ where: { email } });
  
  if (!user || !user.isVerified) throw new Error('Verify OTP first');
  user.name = name;
  await user.save();
  console.log(`User ${user.id} signed up with name: ${name}`);
  return { id: user.id, email: user.email, name: user.name };
}