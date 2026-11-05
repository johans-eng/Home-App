import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { Todo, User } from '../db/database';
import { logActivity, broadcast } from '../socket/socketManager';

const router = Router();

// Get all todos (with user names)
router.get('/', (req, res) => {
  const todos = db.prepare(`
    SELECT t.*, u.name as user_name 
    FROM todos t 
    JOIN users u ON t.user_id = u.id 
    ORDER BY t.completed, t.created_at DESC
  `).all() as Todo[];
  res.json(todos);
});

// Get incomplete todos
router.get('/pending', (req, res) => {
  const todos = db.prepare(`
    SELECT t.*, u.name as user_name 
    FROM todos t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.completed = 0
    ORDER BY t.created_at DESC
  `).all() as Todo[];
  res.json(todos);
});

// Get todos by user
router.get('/user/:userId', (req, res) => {
  const todos = db.prepare(`
    SELECT t.*, u.name as user_name 
    FROM todos t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.user_id = ?
    ORDER BY t.completed, t.created_at DESC
  `).all(req.params.userId) as Todo[];
  res.json(todos);
});

// Create todo
router.post('/', (req, res) => {
  const { user_id, title } = req.body;
  
  if (!user_id || !title) {
    return res.status(400).json({ error: 'user_id and title are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id) as User | undefined;
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const id = uuidv4();
  db.prepare('INSERT INTO todos (id, user_id, title) VALUES (?, ?, ?)')
    .run(id, user_id, title);
  
  const todo = db.prepare(`
    SELECT t.*, u.name as user_name 
    FROM todos t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.id = ?
  `).get(id) as Todo;
  
  logActivity(user_id, 'todo_created', `${user.name} added to-do: ${title}`);
  broadcast('todo_created', todo);
  
  res.status(201).json(todo);
});

// Toggle todo completion
router.put('/:id/toggle', (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id) as Todo | undefined;
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const newCompleted = todo.completed ? 0 : 1;
  const completedAt = newCompleted ? new Date().toISOString() : null;
  
  db.prepare('UPDATE todos SET completed = ?, completed_at = ? WHERE id = ?')
    .run(newCompleted, completedAt, req.params.id);
  
  const updated = db.prepare(`
    SELECT t.*, u.name as user_name 
    FROM todos t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.id = ?
  `).get(req.params.id) as Todo;
  
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(todo.user_id) as User;
  const action = newCompleted ? 'completed' : 'uncompleted';
  logActivity(todo.user_id, 'todo_toggled', `${user.name} ${action}: ${todo.title}`);
  broadcast('todo_updated', updated);
  
  res.json(updated);
});

// Update todo
router.put('/:id', (req, res) => {
  const { title, completed } = req.body;
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id) as Todo | undefined;
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const completedAt = completed && !todo.completed ? new Date().toISOString() : todo.completed_at;
  
  db.prepare('UPDATE todos SET title = ?, completed = ?, completed_at = ? WHERE id = ?')
    .run(
      title || todo.title,
      completed !== undefined ? (completed ? 1 : 0) : todo.completed,
      completedAt,
      req.params.id
    );
  
  const updated = db.prepare(`
    SELECT t.*, u.name as user_name 
    FROM todos t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.id = ?
  `).get(req.params.id) as Todo;
  
  broadcast('todo_updated', updated);
  
  res.json(updated);
});

// Delete todo
router.delete('/:id', (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id) as Todo | undefined;
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
  broadcast('todo_deleted', { id: req.params.id });
  
  res.json({ success: true });
});

export default router;
