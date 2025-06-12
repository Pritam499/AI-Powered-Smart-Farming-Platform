// backend/src/routes/ipRoutes.js
import express from 'express';
import IpAccess from '../models/ipAccess.js';

const router = express.Router();

// GET /api/ip/check
router.get('/check', async (req, res, next) => {
  try {
    // trust X-Forwarded-For if you're behind a proxy (Render, Heroku, etc.)
    const ip = (req.headers['x-forwarded-for']?.split(',')[0] 
              || req.socket.remoteAddress)
              .trim();

    // look up or create
    let record = await IpAccess.findByPk(ip);
    if (!record) {
      // first-time visitor: record it and tell client they haven't used it yet
      record = await IpAccess.create({ ip, used: true });
      return res.json({ hasTried: false });
    }

    // existing record → they've already used it
    return res.json({ hasTried: record.used });
  } catch (err) {
    next(err);
  }
});

export default router;
