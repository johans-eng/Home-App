import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db, { Appointment, getUserName, now } from '../db/database.js';
import { logActivity, broadcast } from '../socket/socketManager.js';

const router = Router();

// Get all appointments (with user names)
router.get('/', async (req, res) => {
  await db.read();
  const appointments = db.data!.appointments
    .map(a => ({ ...a, user_name: getUserName(a.user_id) }))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  res.json(appointments);
});

// Get today's appointments
router.get('/today', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  await db.read();
  const appointments = db.data!.appointments
    .filter(a => a.date === today)
    .map(a => ({ ...a, user_name: getUserName(a.user_id) }))
    .sort((a, b) => a.time.localeCompare(b.time));
  res.json(appointments);
});

// Get appointments by user
router.get('/user/:userId', async (req, res) => {
  await db.read();
  const appointments = db.data!.appointments
    .filter(a => a.user_id === req.params.userId)
    .map(a => ({ ...a, user_name: getUserName(a.user_id) }))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  res.json(appointments);
});

// Create appointment
router.post('/', async (req, res) => {
  const { user_id, title, date, time, notes } = req.body;
  
  if (!user_id || !title || !date || !time) {
    return res.status(400).json({ error: 'user_id, title, date, and time are required' });
  }

  await db.read();
  const user = db.data!.users.find(u => u.id === user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const appointment: Appointment = {
    id: uuidv4(),
    user_id,
    title,
    date,
    time,
    notes: notes || undefined,
    created_at: now()
  };

  db.data!.appointments.push(appointment);
  await db.write();
  
  const withUserName = { ...appointment, user_name: user.name };
  logActivity(user_id, 'appointment_created', `${user.name} added appointment: ${title}`);
  broadcast('appointment_created', withUserName);
  
  res.status(201).json(withUserName);
});

// Update appointment
router.put('/:id', async (req, res) => {
  const { title, date, time, notes } = req.body;
  await db.read();
  
  const aptIndex = db.data!.appointments.findIndex(a => a.id === req.params.id);
  if (aptIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  const appointment = db.data!.appointments[aptIndex];
  if (title) appointment.title = title;
  if (date) appointment.date = date;
  if (time) appointment.time = time;
  if (notes !== undefined) appointment.notes = notes;
  
  await db.write();
  
  const withUserName = { ...appointment, user_name: getUserName(appointment.user_id) };
  broadcast('appointment_updated', withUserName);
  
  res.json(withUserName);
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  await db.read();
  
  const aptIndex = db.data!.appointments.findIndex(a => a.id === req.params.id);
  if (aptIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  db.data!.appointments.splice(aptIndex, 1);
  await db.write();
  broadcast('appointment_deleted', { id: req.params.id });
  
  res.json({ success: true });
});

export default router;
