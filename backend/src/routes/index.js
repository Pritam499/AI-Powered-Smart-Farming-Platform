// backend/src/routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import diseaseRoutes from './diseaseRoutes.js';
import ipRoutes from './ipRoutes.js'; 
// import forecastRoutes from './forecastRoutes.js';
// import chatRoutes from './chatRoutes.js';

const router = express.Router();

// IP-based rate‐limit check
router.use('/ip', ipRoutes);

router.use('/auth', authRoutes);
router.use('/disease', diseaseRoutes);
// router.use('/forecast', forecastRoutes);
// router.use('/chat', chatRoutes);

// health check
router.get('/', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

export default router;