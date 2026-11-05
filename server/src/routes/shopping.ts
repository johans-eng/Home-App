import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { ShoppingItem, User } from '../db/database';
import { logActivity, broadcast } from '../socket/socketManager';

const router = Router();

// Get all shopping items (with user names)
router.get('/', (req, res) => {
  const items = db.prepare(`
    SELECT s.*, u.name as user_name 
    FROM shopping_items s 
    JOIN users u ON s.user_id = u.id 
    ORDER BY s.checked, s.created_at DESC
  `).all() as ShoppingItem[];
  res.json(items);
});

// Get unchecked items
router.get('/pending', (req, res) => {
  const items = db.prepare(`
    SELECT s.*, u.name as user_name 
    FROM shopping_items s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.checked = 0
    ORDER BY s.created_at DESC
  `).all() as ShoppingItem[];
  res.json(items);
});

// Create shopping item
router.post('/', (req, res) => {
  const { user_id, name, quantity } = req.body;
  
  if (!user_id || !name) {
    return res.status(400).json({ error: 'user_id and name are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id) as User | undefined;
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const id = uuidv4();
  db.prepare('INSERT INTO shopping_items (id, user_id, name, quantity) VALUES (?, ?, ?, ?)')
    .run(id, user_id, name, quantity || 1);
  
  const item = db.prepare(`
    SELECT s.*, u.name as user_name 
    FROM shopping_items s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.id = ?
  `).get(id) as ShoppingItem;
  
  logActivity(user_id, 'shopping_added', `${user.name} added to shopping: ${name}`);
  broadcast('shopping_created', item);
  
  res.status(201).json(item);
});

// Toggle checked status
router.put('/:id/toggle', (req, res) => {
  const item = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(req.params.id) as ShoppingItem | undefined;
  
  if (!item) {
    return res.status(404).json({ error: 'Shopping item not found' });
  }

  const newChecked = item.checked ? 0 : 1;
  
  db.prepare('UPDATE shopping_items SET checked = ? WHERE id = ?')
    .run(newChecked, req.params.id);
  
  const updated = db.prepare(`
    SELECT s.*, u.name as user_name 
    FROM shopping_items s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.id = ?
  `).get(req.params.id) as ShoppingItem;
  
  broadcast('shopping_updated', updated);
  
  res.json(updated);
});

// Update shopping item
router.put('/:id', (req, res) => {
  const { name, quantity, checked } = req.body;
  const item = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(req.params.id) as ShoppingItem | undefined;
  
  if (!item) {
    return res.status(404).json({ error: 'Shopping item not found' });
  }

  db.prepare('UPDATE shopping_items SET name = ?, quantity = ?, checked = ? WHERE id = ?')
    .run(
      name || item.name,
      quantity !== undefined ? quantity : item.quantity,
      checked !== undefined ? (checked ? 1 : 0) : item.checked,
      req.params.id
    );
  
  const updated = db.prepare(`
    SELECT s.*, u.name as user_name 
    FROM shopping_items s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.id = ?
  `).get(req.params.id) as ShoppingItem;
  
  broadcast('shopping_updated', updated);
  
  res.json(updated);
});

// Delete shopping item
router.delete('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(req.params.id) as ShoppingItem | undefined;
  
  if (!item) {
    return res.status(404).json({ error: 'Shopping item not found' });
  }

  db.prepare('DELETE FROM shopping_items WHERE id = ?').run(req.params.id);
  broadcast('shopping_deleted', { id: req.params.id });
  
  res.json({ success: true });
});

// Clear all checked items
router.delete('/clear/checked', (req, res) => {
  db.prepare('DELETE FROM shopping_items WHERE checked = 1').run();
  broadcast('shopping_cleared', {});
  res.json({ success: true });
});

export default router;
