// backend/src/controllers/disease/predictProxyController.js
import axios from 'axios';
import generateResponse from '../../utils/generateResponse.js';
import { hasUsedTrial, markTrialUsed } from '../../services/ipAccessService.js';
import FormData from 'form-data';

export async function predictDiseaseProxy(req, res, next) {
  try {
    const ip = req.ip;

    // Check if already used
    if (await hasUsedTrial(ip)) {
      return res.status(403).json(generateResponse(false, null, 'Trial already used. Please sign up.'));
    }

    // Prepare file and crop for AI service
    const form = new FormData();
    form.append('file', req.files.file.data, req.files.file.name);
    form.append('crop', req.body.crop);

    const response = await axios.post(
      // 'https://ai-smart-farm-ziir.onrender.com/predict-disease',
      'http://localhost:8000/predict-disease',
      form,
      { headers: form.getHeaders() }
    );

    // Mark IP as used
    await markTrialUsed(ip);

    return res.json(generateResponse(true, response.data, 'Prediction success'));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateResponse(false, null, 'Prediction failed'));
  }
}
