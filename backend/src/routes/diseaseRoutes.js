// backend/src/routes/diseaseRoutes.js
import express from 'express';
import { predictDiseaseProxy } from '../controllers/disease/predictProxyController.js';

const router = express.Router();

// Allow once per IP
router.post('/predict', predictDiseaseProxy);

export default router;
