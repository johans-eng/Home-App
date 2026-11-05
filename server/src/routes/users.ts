import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { User } from '../db/database';
import { logActivity, broadcast } from '../socket/socketManager';

const router = Router();

// Get all users
router.get('/', (req, res) => {
  const users = db.prepare('SELECT * FROM users ORDER BY name').all() as User[];
  res.json(users);
});

// Get single user
router.get('/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as User | undefined;
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Create user
router.post('/', (req, res) => {
  const { name, avatar } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const id = uuidv4();
  db.prepare('INSERT INTO users (id, name, avatar) VALUES (?, ?, ?)').run(id, name, avatar || null);
  
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User;
  
  logActivity(id, 'user_joined', `${name} joined the home`);
  broadcast('user_created', user);
  
  res.status(201).json(user);
});

// Update user
router.put('/:id', (req, res) => {
  const { name, avatar } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as User | undefined;
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.prepare('UPDATE users SET name = ?, avatar = ? WHERE id = ?')
    .run(name || user.name, avatar !== undefined ? avatar : user.avatar, req.params.id);
  
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as User;
  broadcast('user_updated', updated);
  
  res.json(updated);
});

// Update home status
router.put('/:id/status', (req, res) => {
  const { is_home } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as User | undefined;
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE users SET is_home = ?, last_status_change = ? WHERE id = ?')
    .run(is_home ? 1 : 0, now, req.params.id);
  
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as User;
  
  const statusText = is_home ? 'arrived home' : 'left home';
  logActivity(req.params.id, 'status_change', `${user.name} ${statusText}`);
  broadcast('user_status_changed', updated);
  
  res.json(updated);
});

// Delete user
router.delete('/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id) as User | undefined;
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  broadcast('user_deleted', { id: req.params.id });
  
  res.json({ success: true });
});

export default router;
