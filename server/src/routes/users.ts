import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { User, now } from '../db/database.js';
import { logActivity, broadcast } from '../socket/socketManager.js';

const router = Router();

// Get all users
router.get('/', async (req, res) => {
  await db.read();
  const users = db.data!.users.sort((a, b) => a.name.localeCompare(b.name));
  res.json(users);
});

// Get single user
router.get('/:id', async (req, res) => {
  await db.read();
  const user = db.data!.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Create user
router.post('/', async (req, res) => {
  const { name, avatar } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const user: User = {
    id: uuidv4(),
    name,
    avatar: avatar || undefined,
    is_home: 0,
    created_at: now()
  };

  db.data!.users.push(user);
  await db.write();
  
  logActivity(user.id, 'user_joined', `${name} joined the home`);
  broadcast('user_created', user);
  
  res.status(201).json(user);
});

// Update user
router.put('/:id', async (req, res) => {
  const { name, avatar } = req.body;
  await db.read();
  
  const userIndex = db.data!.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = db.data!.users[userIndex];
  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  
  await db.write();
  broadcast('user_updated', user);
  
  res.json(user);
});

// Update home status
router.put('/:id/status', async (req, res) => {
  const { is_home } = req.body;
  await db.read();
  
  const userIndex = db.data!.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = db.data!.users[userIndex];
  user.is_home = is_home ? 1 : 0;
  user.last_status_change = now();
  
  await db.write();
  
  const statusText = is_home ? 'arrived home' : 'left home';
  logActivity(user.id, 'status_change', `${user.name} ${statusText}`);
  broadcast('user_status_changed', user);
  
  res.json(user);
});

// Delete user
router.delete('/:id', async (req, res) => {
  await db.read();
  
  const userIndex = db.data!.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.data!.users.splice(userIndex, 1);
  await db.write();
  broadcast('user_deleted', { id: req.params.id });
  
  res.json({ success: true });
});

export default router;
