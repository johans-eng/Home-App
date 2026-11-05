import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import database and initialize
import { initDb } from './db/database.js';

// Import routes
import usersRouter from './routes/users.js';
import appointmentsRouter from './routes/appointments.js';
import todosRouter from './routes/todos.js';
import shoppingRouter from './routes/shopping.js';
import activityRouter from './routes/activity.js';
import { initializeSocket } from './socket/socketManager.js';

async function main() {
  // Initialize database first
  await initDb();

  const app = express();
  const server = http.createServer(app);

  // Initialize Socket.io
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  initializeSocket(io);

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Serve static files from web client build
  const clientBuildPath = path.join(__dirname, '../../web-client/dist');
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
  }

  // API Routes
  app.use('/api/users', usersRouter);
  app.use('/api/appointments', appointmentsRouter);
  app.use('/api/todos', todosRouter);
  app.use('/api/shopping', shoppingRouter);
  app.use('/api/activity', activityRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve web client for any non-API routes
  app.get('*', (req, res) => {
    if (fs.existsSync(clientBuildPath)) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
      res.json({ message: 'Home App Server is running. Build web client to serve UI.' });
    }
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║           🏠 Home App Server Running               ║
╠════════════════════════════════════════════════════╣
║  Local:   http://localhost:${PORT}                   ║
║  Network: http://<your-ip>:${PORT}                   ║
╠════════════════════════════════════════════════════╣
║  API Endpoints:                                    ║
║  • GET/POST   /api/users                           ║
║  • GET/POST   /api/appointments                    ║
║  • GET/POST   /api/todos                           ║
║  • GET/POST   /api/shopping                        ║
║  • GET        /api/activity                        ║
╚════════════════════════════════════════════════════╝
    `);
  });
}

main().catch(console.error);
