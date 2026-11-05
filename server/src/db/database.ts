import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { mkdirSync, existsSync } from 'fs';

// Types
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

interface DbData {
  users: User[];
  appointments: Appointment[];
  todos: Todo[];
  shopping_items: ShoppingItem[];
  activity_log: ActivityLog[];
}

const defaultData: DbData = {
  users: [],
  appointments: [],
  todos: [],
  shopping_items: [],
  activity_log: []
};

// Ensure data directory exists
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'home-app.json');
const adapter = new JSONFile<DbData>(dbPath);
const db = new Low<DbData>(adapter, defaultData);

// Initialize function (call this before using db)
let initialized = false;
export async function initDb() {
  if (initialized) return;
  await db.read();
  db.data ||= defaultData;
  await db.write();
  initialized = true;
}

export default db;

// Helper functions
export function getUserName(userId: string): string | undefined {
  return db.data?.users.find(u => u.id === userId)?.name;
}

export function now(): string {
  return new Date().toISOString();
}
