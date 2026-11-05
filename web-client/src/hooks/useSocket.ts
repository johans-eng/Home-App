import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { AppState, User, Appointment, Todo, ShoppingItem, ActivityLog } from '../types';

const SOCKET_URL = import.meta.env.PROD ? window.location.origin : 'http://localhost:3000';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState<AppState>({
    users: [],
    appointments: [],
    todos: [],
    shopping: [],
    activity: []
  });

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('initial_state', (initialState: AppState) => {
      setState(initialState);
    });

    // User events
    newSocket.on('user_created', (user: User) => {
      setState(prev => ({ ...prev, users: [...prev.users, user] }));
    });

    newSocket.on('user_updated', (user: User) => {
      setState(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === user.id ? user : u)
      }));
    });

    newSocket.on('user_status_changed', (user: User) => {
      setState(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === user.id ? user : u)
      }));
    });

    newSocket.on('user_deleted', ({ id }: { id: string }) => {
      setState(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== id)
      }));
    });

    // Appointment events
    newSocket.on('appointment_created', (appointment: Appointment) => {
      setState(prev => ({ ...prev, appointments: [...prev.appointments, appointment] }));
    });

    newSocket.on('appointment_updated', (appointment: Appointment) => {
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.map(a => a.id === appointment.id ? appointment : a)
      }));
    });

    newSocket.on('appointment_deleted', ({ id }: { id: string }) => {
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.filter(a => a.id !== id)
      }));
    });

    // Todo events
    newSocket.on('todo_created', (todo: Todo) => {
      setState(prev => ({ ...prev, todos: [todo, ...prev.todos] }));
    });

    newSocket.on('todo_updated', (todo: Todo) => {
      setState(prev => ({
        ...prev,
        todos: prev.todos.map(t => t.id === todo.id ? todo : t)
      }));
    });

    newSocket.on('todo_deleted', ({ id }: { id: string }) => {
      setState(prev => ({
        ...prev,
        todos: prev.todos.filter(t => t.id !== id)
      }));
    });

    // Shopping events
    newSocket.on('shopping_created', (item: ShoppingItem) => {
      setState(prev => ({ ...prev, shopping: [item, ...prev.shopping] }));
    });

    newSocket.on('shopping_updated', (item: ShoppingItem) => {
      setState(prev => ({
        ...prev,
        shopping: prev.shopping.map(s => s.id === item.id ? item : s)
      }));
    });

    newSocket.on('shopping_deleted', ({ id }: { id: string }) => {
      setState(prev => ({
        ...prev,
        shopping: prev.shopping.filter(s => s.id !== id)
      }));
    });

    newSocket.on('shopping_cleared', () => {
      setState(prev => ({
        ...prev,
        shopping: prev.shopping.filter(s => !s.checked)
      }));
    });

    // Activity events
    newSocket.on('activity_created', (activity: ActivityLog) => {
      setState(prev => ({
        ...prev,
        activity: [activity, ...prev.activity.slice(0, 49)]
      }));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, connected, state, setState };
}
