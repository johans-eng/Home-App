import { CheckSquare, Check } from 'lucide-react';
import { Todo } from '../../types';
import { api } from '../../hooks/useApi';

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  const pendingTodos = todos.filter(t => !t.completed);
  const completedToday = todos.filter(t => {
    if (!t.completed || !t.completed_at) return false;
    const today = new Date().toISOString().split('T')[0];
    return t.completed_at.startsWith(today);
  });

  const handleToggle = async (id: string) => {
    try {
      await api.toggleTodo(id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
          <CheckSquare className="w-5 h-5 text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">To-Do List</h2>
        <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
          {pendingTodos.length} pending
        </span>
      </div>

      {pendingTodos.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-slate-500">All tasks completed! 🎉</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {pendingTodos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl group"
            >
              <button
                onClick={() => handleToggle(todo.id)}
                className="w-5 h-5 border-2 border-slate-500 rounded group-hover:border-green-500 transition-colors flex-shrink-0"
              />
              <span className="text-white text-sm flex-1 truncate">{todo.title}</span>
              <span className="text-xs text-slate-500">{todo.user_name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Completed today */}
      {completedToday.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-2">Completed today ({completedToday.length})</p>
          <div className="space-y-1">
            {completedToday.slice(0, 3).map(todo => (
              <div key={todo.id} className="flex items-center gap-2 text-sm opacity-50">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-slate-400 line-through truncate">{todo.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
