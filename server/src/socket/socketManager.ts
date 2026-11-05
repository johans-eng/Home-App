import { Server as SocketServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import db, { getUserName, now } from '../db/database.js';

let io: SocketServer | null = null;

export function initializeSocket(socketServer: SocketServer) {
  io = socketServer;

  io.on('connection', async (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send current state to new client
    await db.read();
    
    socket.emit('initial_state', {
      users: db.data!.users.sort((a, b) => a.name.localeCompare(b.name)),
      appointments: db.data!.appointments
        .map(a => ({ ...a, user_name: getUserName(a.user_id) }))
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
      todos: db.data!.todos
        .map(t => ({ ...t, user_name: getUserName(t.user_id) }))
        .sort((a, b) => {
          if (a.completed !== b.completed) return a.completed - b.completed;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }),
      shopping: db.data!.shopping_items
        .map(s => ({ ...s, user_name: getUserName(s.user_id) }))
        .sort((a, b) => {
          if (a.checked !== b.checked) return a.checked - b.checked;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }),
      activity: db.data!.activity_log
        .map(a => ({ ...a, user_name: getUserName(a.user_id) }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 50)
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

export async function logActivity(userId: string, action: string, details: string) {
  const activity = {
    id: uuidv4(),
    user_id: userId,
    action,
    details,
    created_at: now()
  };
  
  db.data!.activity_log.push(activity);
  await db.write();
  
  const withUserName = { ...activity, user_name: getUserName(userId) };
  broadcast('activity_created', withUserName);
}
