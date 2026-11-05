import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { Todo, getUserName, now } from '../db/database.js';
import { logActivity, broadcast } from '../socket/socketManager.js';

const router = Router();

// Get all todos (with user names)
router.get('/', async (req, res) => {
  await db.read();
  const todos = db.data!.todos
    .map(t => ({ ...t, user_name: getUserName(t.user_id) }))
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed - b.completed;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  res.json(todos);
});

// Get incomplete todos
router.get('/pending', async (req, res) => {
  await db.read();
  const todos = db.data!.todos
    .filter(t => !t.completed)
    .map(t => ({ ...t, user_name: getUserName(t.user_id) }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json(todos);
});

// Get todos by user
router.get('/user/:userId', async (req, res) => {
  await db.read();
  const todos = db.data!.todos
    .filter(t => t.user_id === req.params.userId)
    .map(t => ({ ...t, user_name: getUserName(t.user_id) }))
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed - b.completed;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  res.json(todos);
});

// Create todo
router.post('/', async (req, res) => {
  const { user_id, title } = req.body;
  
  if (!user_id || !title) {
    return res.status(400).json({ error: 'user_id and title are required' });
  }

  await db.read();
  const user = db.data!.users.find(u => u.id === user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const todo: Todo = {
    id: uuidv4(),
    user_id,
    title,
    completed: 0,
    created_at: now()
  };

  db.data!.todos.push(todo);
  await db.write();
  
  const withUserName = { ...todo, user_name: user.name };
  logActivity(user_id, 'todo_created', `${user.name} added to-do: ${title}`);
  broadcast('todo_created', withUserName);
  
  res.status(201).json(withUserName);
});

// Toggle todo completion
router.put('/:id/toggle', async (req, res) => {
  await db.read();
  
  const todoIndex = db.data!.todos.findIndex(t => t.id === req.params.id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const todo = db.data!.todos[todoIndex];
  todo.completed = todo.completed ? 0 : 1;
  todo.completed_at = todo.completed ? now() : undefined;
  
  await db.write();
  
  const user = db.data!.users.find(u => u.id === todo.user_id);
  const action = todo.completed ? 'completed' : 'uncompleted';
  if (user) {
    logActivity(todo.user_id, 'todo_toggled', `${user.name} ${action}: ${todo.title}`);
  }
  
  const withUserName = { ...todo, user_name: getUserName(todo.user_id) };
  broadcast('todo_updated', withUserName);
  
  res.json(withUserName);
});

// Update todo
router.put('/:id', async (req, res) => {
  const { title, completed } = req.body;
  await db.read();
  
  const todoIndex = db.data!.todos.findIndex(t => t.id === req.params.id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const todo = db.data!.todos[todoIndex];
  if (title) todo.title = title;
  if (completed !== undefined) {
    todo.completed = completed ? 1 : 0;
    if (completed && !todo.completed_at) {
      todo.completed_at = now();
    }
  }
  
  await db.write();
  
  const withUserName = { ...todo, user_name: getUserName(todo.user_id) };
  broadcast('todo_updated', withUserName);
  
  res.json(withUserName);
});

// Delete todo
router.delete('/:id', async (req, res) => {
  await db.read();
  
  const todoIndex = db.data!.todos.findIndex(t => t.id === req.params.id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  db.data!.todos.splice(todoIndex, 1);
  await db.write();
  broadcast('todo_deleted', { id: req.params.id });
  
  res.json({ success: true });
});

export default router;
