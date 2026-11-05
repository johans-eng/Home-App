import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { Appointment, User } from '../db/database';
import { logActivity, broadcast } from '../socket/socketManager';

const router = Router();

// Get all appointments (with user names)
router.get('/', (req, res) => {
  const appointments = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM appointments a 
    JOIN users u ON a.user_id = u.id 
    ORDER BY a.date, a.time
  `).all() as Appointment[];
  res.json(appointments);
});

// Get today's appointments
router.get('/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const appointments = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM appointments a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.date = ?
    ORDER BY a.time
  `).all(today) as Appointment[];
  res.json(appointments);
});

// Get appointments by user
router.get('/user/:userId', (req, res) => {
  const appointments = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM appointments a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.user_id = ?
    ORDER BY a.date, a.time
  `).all(req.params.userId) as Appointment[];
  res.json(appointments);
});

// Create appointment
router.post('/', (req, res) => {
  const { user_id, title, date, time, notes } = req.body;
  
  if (!user_id || !title || !date || !time) {
    return res.status(400).json({ error: 'user_id, title, date, and time are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(user_id) as User | undefined;
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const id = uuidv4();
  db.prepare('INSERT INTO appointments (id, user_id, title, date, time, notes) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, user_id, title, date, time, notes || null);
  
  const appointment = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM appointments a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.id = ?
  `).get(id) as Appointment;
  
  logActivity(user_id, 'appointment_created', `${user.name} added appointment: ${title}`);
  broadcast('appointment_created', appointment);
  
  res.status(201).json(appointment);
});

// Update appointment
router.put('/:id', (req, res) => {
  const { title, date, time, notes } = req.body;
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id) as Appointment | undefined;
  
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  db.prepare('UPDATE appointments SET title = ?, date = ?, time = ?, notes = ? WHERE id = ?')
    .run(
      title || appointment.title,
      date || appointment.date,
      time || appointment.time,
      notes !== undefined ? notes : appointment.notes,
      req.params.id
    );
  
  const updated = db.prepare(`
    SELECT a.*, u.name as user_name 
    FROM appointments a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.id = ?
  `).get(req.params.id) as Appointment;
  
  broadcast('appointment_updated', updated);
  
  res.json(updated);
});

// Delete appointment
router.delete('/:id', (req, res) => {
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id) as Appointment | undefined;
  
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  db.prepare('DELETE FROM appointments WHERE id = ?').run(req.params.id);
  broadcast('appointment_deleted', { id: req.params.id });
  
  res.json({ success: true });
});

export default router;
