import { Router } from 'express';
import db, { ActivityLog } from '../db/database';

const router = Router();

// Get recent activity (last 50 items)
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const activity = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM activity_log a 
    JOIN users u ON a.user_id = u.id 
    ORDER BY a.created_at DESC 
    LIMIT ?
  `).all(limit) as ActivityLog[];
  res.json(activity);
});

// Get activity by user
router.get('/user/:userId', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const activity = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM activity_log a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.user_id = ?
    ORDER BY a.created_at DESC 
    LIMIT ?
  `).all(req.params.userId, limit) as ActivityLog[];
  res.json(activity);
});

// Get today's activity
router.get('/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const activity = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM activity_log a 
    JOIN users u ON a.user_id = u.id 
    WHERE date(a.created_at) = ?
    ORDER BY a.created_at DESC
  `).all(today) as ActivityLog[];
  res.json(activity);
});

export default router;
