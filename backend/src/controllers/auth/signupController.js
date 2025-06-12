// backend/src/controllers/auth/signupController.js
import generateResponse from '../../utils/generateResponse.js';
import * as authService from '../../services/authService.js';

export async function signupController(req, res, next) {
  try {
    const { name } = req.body;
    const { email } = req.user; // from JWT

    const user = await authService.signup(email, name);
    return res.json(generateResponse(true, user, 'Signup successful'));
  } catch (err) {
    next(err);
  }
}
