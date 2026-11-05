import { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { Todo } from '../../types';
import { api } from '../../hooks/useApi';

interface TodoFormProps {
  userId: string;
  todos: Todo[];
}

export default function TodoForm({ userId, todos }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await api.createTodo(userId, title.trim());
      setTitle('');
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.toggleTodo(id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTodo(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add To-Do</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!title.trim() || loading}
            className="px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Pending todos */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Pending ({pendingTodos.length})
        </h2>
        {pendingTodos.length === 0 ? (
          <p className="text-slate-500 text-center py-4">All done! 🎉</p>
        ) : (
          <div className="space-y-2">
            {pendingTodos.map(todo => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl"
              >
                <button
                  onClick={() => handleToggle(todo.id)}
                  className="w-6 h-6 border-2 border-slate-500 rounded-lg hover:border-green-500 transition-colors flex items-center justify-center"
                >
                </button>
                <span className="flex-1 text-white">{todo.title}</span>
                {todo.user_name && todo.user_id !== userId && (
                  <span className="text-xs text-slate-500">{todo.user_name}</span>
                )}
                {todo.user_id === userId && (
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed todos */}
      {completedTodos.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Completed ({completedTodos.length})
          </h2>
          <div className="space-y-2">
            {completedTodos.slice(0, 5).map(todo => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-slate-700/20 rounded-xl opacity-60"
              >
                <button
                  onClick={() => handleToggle(todo.id)}
                  className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
                <span className="flex-1 text-slate-400 line-through">{todo.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
