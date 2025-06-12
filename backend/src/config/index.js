// backend/src/config/index.js
import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4200';
export const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const MODEL_SERVICE_URL = process.env.MODEL_SERVICE_URL || 'http://localhost:8000';

// Database config imported via db.js
