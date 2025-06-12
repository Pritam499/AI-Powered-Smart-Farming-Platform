// backend/src/utils/pythonClient.js
import axios from 'axios';
import FormData from 'form-data';
import { MODEL_SERVICE_URL } from '../config/index.js';

const client = axios.create({
  baseURL: MODEL_SERVICE_URL,
  timeout: 10_000,
});

export async function predictDiseaseWithPython(buffer, filename = 'upload.jpg') {
  const form = new FormData();
  form.append('file', buffer, filename);

  const headers = form.getHeaders();

  const resp = await client.post('/predict-disease', form, { headers });
  // Expect response: { disease: string, confidence: number }
  return resp.data;
}