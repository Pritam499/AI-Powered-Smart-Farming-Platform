// /**
//  * Main application file.
//  *
//  * This file sets up the Express server, connects to the database,
//  * and mounts the API routes.
//  *
//  * @module app
//  */

// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';
// import path from 'path';
// import csurf from 'csurf';
// import dotenv from 'dotenv';

// import routes from './routes/index.js';
// import { connectDb } from './config/db.js';
// import errorHandler from './middlewares/errorHandler.js';

// dotenv.config();
// const csrfProtection = csurf({ cookie: true });

// const app = express();

// // Enable CORS
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:4200',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// // Security headers
// app.use(
//   helmet({
//     crossOriginOpenerPolicy: false,
//   })
// );

// // Gzip compression
// app.use(compression());

// // Parse JSON bodies
// app.use(express.json());

// // Optional: CSRF protection
// // app.use(csrfProtection);

// // Static assets (if any)
// app.use('/public', express.static(path.join(process.cwd(), 'public'), { dotfiles: 'deny' }));

// // Connect to the database
// connectDb();

// // Mount API routes
// app.use('/api', routes);

// // Global error handler
// app.use(errorHandler);

// export default app;



import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import routes from './routes/index.js';
import { connectDb } from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import csurf from 'csurf';
import dotenv from 'dotenv';

dotenv.config();
const csrfProtection = csurf({ cookie: true });


const app = express();

// Enable CORS
// app.use(cors(
//   {
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   },
// ));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Fallback for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable Helmet security middleware
app.use(helmet({
  crossOriginOpenerPolicy: false,
}));

// Enable Gzip compression
app.use(compression());

// Parse JSON bodies
app.use(express.json());

// // Enable CSRF protection
// app.use(csrfProtection);

// Define error handler
app.use(errorHandler);

// Make uploaded assets accessible
// incase you want to access uploaded assets
app.use('/public', express.static(path.join('public'), { dotfiles: 'deny' }));

// Serve Swagger UI
// app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocument));

// Disable the "X-Powered-By" header
app.disable('x-powered-by');

// Connect to the database
connectDb();

// Mount the API routes
app.use('/api', routes);

export default app;