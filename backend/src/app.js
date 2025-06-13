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





// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import csurf from 'csurf';
import dotenv from 'dotenv';

import routes from './routes/index.js';
import { connectDb } from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// CORS (will automatically respond to OPTIONS)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  })
);

app.use(helmet( ));
app.use(compression());
app.use(express.json());
// app.use(csurf({ cookie: true })); // optional

app.use('/public', express.static(path.join(process.cwd(), 'public')));

// connect to your DB
connectDb();

// mount all routers under /api
app.use('/api', routes);

// global error handler
app.use(errorHandler);

export default app;
