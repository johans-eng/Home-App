import { Router } from 'express';
import db, { getUserName } from '../db/database.js';

const router = Router();

// Get recent activity (last 50 items)
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50;
  await db.read();
  const activity = db.data!.activity_log
    .map(a => ({ ...a, user_name: getUserName(a.user_id) }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
  res.json(activity);
});

// Get activity by user
router.get('/user/:userId', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50;
  await db.read();
  const activity = db.data!.activity_log
    .filter(a => a.user_id === req.params.userId)
    .map(a => ({ ...a, user_name: getUserName(a.user_id) }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
  res.json(activity);
});

// Get today's activity
router.get('/today', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  await db.read();
  const activity = db.data!.activity_log
    .filter(a => a.created_at.startsWith(today))
    .map(a => ({ ...a, user_name: getUserName(a.user_id) }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json(activity);
});

export default router;
