import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { ShoppingItem, getUserName, now } from '../db/database.js';
import { logActivity, broadcast } from '../socket/socketManager.js';

const router = Router();

// Get all shopping items (with user names)
router.get('/', async (req, res) => {
  await db.read();
  const items = db.data!.shopping_items
    .map(s => ({ ...s, user_name: getUserName(s.user_id) }))
    .sort((a, b) => {
      if (a.checked !== b.checked) return a.checked - b.checked;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  res.json(items);
});

// Get unchecked items
router.get('/pending', async (req, res) => {
  await db.read();
  const items = db.data!.shopping_items
    .filter(s => !s.checked)
    .map(s => ({ ...s, user_name: getUserName(s.user_id) }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json(items);
});

// Create shopping item
router.post('/', async (req, res) => {
  const { user_id, name, quantity } = req.body;
  
  if (!user_id || !name) {
    return res.status(400).json({ error: 'user_id and name are required' });
  }

  await db.read();
  const user = db.data!.users.find(u => u.id === user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const item: ShoppingItem = {
    id: uuidv4(),
    user_id,
    name,
    quantity: quantity || 1,
    checked: 0,
    created_at: now()
  };

  db.data!.shopping_items.push(item);
  await db.write();
  
  const withUserName = { ...item, user_name: user.name };
  logActivity(user_id, 'shopping_added', `${user.name} added to shopping: ${name}`);
  broadcast('shopping_created', withUserName);
  
  res.status(201).json(withUserName);
});

// Toggle checked status
router.put('/:id/toggle', async (req, res) => {
  await db.read();
  
  const itemIndex = db.data!.shopping_items.findIndex(s => s.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Shopping item not found' });
  }

  const item = db.data!.shopping_items[itemIndex];
  item.checked = item.checked ? 0 : 1;
  
  await db.write();
  
  const withUserName = { ...item, user_name: getUserName(item.user_id) };
  broadcast('shopping_updated', withUserName);
  
  res.json(withUserName);
});

// Update shopping item
router.put('/:id', async (req, res) => {
  const { name, quantity, checked } = req.body;
  await db.read();
  
  const itemIndex = db.data!.shopping_items.findIndex(s => s.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Shopping item not found' });
  }

  const item = db.data!.shopping_items[itemIndex];
  if (name) item.name = name;
  if (quantity !== undefined) item.quantity = quantity;
  if (checked !== undefined) item.checked = checked ? 1 : 0;
  
  await db.write();
  
  const withUserName = { ...item, user_name: getUserName(item.user_id) };
  broadcast('shopping_updated', withUserName);
  
  res.json(withUserName);
});

// Delete shopping item
router.delete('/:id', async (req, res) => {
  await db.read();
  
  const itemIndex = db.data!.shopping_items.findIndex(s => s.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Shopping item not found' });
  }

  db.data!.shopping_items.splice(itemIndex, 1);
  await db.write();
  broadcast('shopping_deleted', { id: req.params.id });
  
  res.json({ success: true });
});

// Clear all checked items
router.delete('/clear/checked', async (req, res) => {
  await db.read();
  db.data!.shopping_items = db.data!.shopping_items.filter(s => !s.checked);
  await db.write();
  broadcast('shopping_cleared', {});
  res.json({ success: true });
});

export default router;
