import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/home-app.db');
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    is_home INTEGER DEFAULT 0,
    last_status_change TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS shopping_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    checked INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export default db;

// Helper types
export interface User {
  id: string;
  name: string;
  avatar?: string;
  is_home: number;
  last_status_change?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  user_name?: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  user_name?: string;
  title: string;
  completed: number;
  created_at: string;
  completed_at?: string;
}

export interface ShoppingItem {
  id: string;
  user_id: string;
  user_name?: string;
  name: string;
  quantity: number;
  checked: number;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name?: string;
  action: string;
  details?: string;
  created_at: string;
}
