import { Server as SocketServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database';

let io: SocketServer | null = null;

export function initializeSocket(socketServer: SocketServer) {
  io = socketServer;

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send current state to new client
    socket.emit('initial_state', {
      users: db.prepare('SELECT * FROM users ORDER BY name').all(),
      appointments: db.prepare(`
        SELECT a.*, u.name as user_name 
        FROM appointments a 
        JOIN users u ON a.user_id = u.id 
        ORDER BY a.date, a.time
      `).all(),
      todos: db.prepare(`
        SELECT t.*, u.name as user_name 
        FROM todos t 
        JOIN users u ON t.user_id = u.id 
        ORDER BY t.completed, t.created_at DESC
      `).all(),
      shopping: db.prepare(`
        SELECT s.*, u.name as user_name 
        FROM shopping_items s 
        JOIN users u ON s.user_id = u.id 
        ORDER BY s.checked, s.created_at DESC
      `).all(),
      activity: db.prepare(`
        SELECT a.*, u.name as user_name 
        FROM activity_log a 
        JOIN users u ON a.user_id = u.id 
        ORDER BY a.created_at DESC 
        LIMIT 50
      `).all()
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

export function broadcast(event: string, data: any) {
  if (io) {
    io.emit(event, data);
  }
}

export function logActivity(userId: string, action: string, details: string) {
  const id = uuidv4();
  db.prepare('INSERT INTO activity_log (id, user_id, action, details) VALUES (?, ?, ?, ?)')
    .run(id, userId, action, details);
  
  const activity = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM activity_log a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.id = ?
  `).get(id);
  
  broadcast('activity_created', activity);
}
