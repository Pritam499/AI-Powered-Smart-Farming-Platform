import http from 'http';
import app from './src/app.js';
import { PORT } from './src/config/index.js';

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
