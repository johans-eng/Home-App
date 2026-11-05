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

export interface AppState {
  users: User[];
  appointments: Appointment[];
  todos: Todo[];
  shopping: ShoppingItem[];
  activity: ActivityLog[];
}
