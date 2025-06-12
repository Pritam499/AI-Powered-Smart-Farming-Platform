import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import DiseaseRecord from '../models/diseaseRecord.js';
import { predictDiseaseWithPython } from '../utils/pythonClient.js';

export async function detectDisease(userId, file) {
  // 1. send to Python microservice
  const { disease, confidence } = await predictDiseaseWithPython(file.buffer, file.originalname);

  // 2. save image locally
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const uploadPath = path.resolve('public', 'uploads', fileName);
  await fs.writeFile(uploadPath, file.buffer);

  // 3. persist result
  const record = await DiseaseRecord.create({
    userId,
    imageUrl: `/public/uploads/${fileName}`,
    disease,
    confidence,
  });

  return { disease, confidence, imageUrl: record.imageUrl };
}
