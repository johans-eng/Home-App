const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Users
  createUser: (name: string) => 
    request<any>('/users', { method: 'POST', body: JSON.stringify({ name }) }),
  
  updateUser: (id: string, data: { name?: string; avatar?: string }) =>
    request<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  setStatus: (id: string, is_home: boolean) =>
    request<any>(`/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ is_home }) }),

  // Appointments
  createAppointment: (user_id: string, title: string, date: string, time: string, notes?: string) =>
    request<any>('/appointments', { 
      method: 'POST', 
      body: JSON.stringify({ user_id, title, date, time, notes }) 
    }),
  
  deleteAppointment: (id: string) =>
    request<any>(`/appointments/${id}`, { method: 'DELETE' }),

  // Todos
  createTodo: (user_id: string, title: string) =>
    request<any>('/todos', { method: 'POST', body: JSON.stringify({ user_id, title }) }),
  
  toggleTodo: (id: string) =>
    request<any>(`/todos/${id}/toggle`, { method: 'PUT' }),
  
  deleteTodo: (id: string) =>
    request<any>(`/todos/${id}`, { method: 'DELETE' }),

  // Shopping
  createShoppingItem: (user_id: string, name: string, quantity?: number) =>
    request<any>('/shopping', { method: 'POST', body: JSON.stringify({ user_id, name, quantity }) }),
  
  toggleShoppingItem: (id: string) =>
    request<any>(`/shopping/${id}/toggle`, { method: 'PUT' }),
  
  deleteShoppingItem: (id: string) =>
    request<any>(`/shopping/${id}`, { method: 'DELETE' }),
  
  clearCheckedItems: () =>
    request<any>('/shopping/clear/checked', { method: 'DELETE' })
};
