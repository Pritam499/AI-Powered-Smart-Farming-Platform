// backend/src/routes/authRoutes.js
import express from 'express';
import {
  signupController,
} from '../controllers/auth/index.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const router = express.Router();


// (Optional) Complete signup/profile setup
router.post('/signup', authMiddleware, signupController);

export default router;
