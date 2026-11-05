import { useState } from 'react';
import { Plus, Check, Trash2, ShoppingBag } from 'lucide-react';
import { ShoppingItem } from '../../types';
import { api } from '../../hooks/useApi';

interface ShoppingFormProps {
  userId: string;
  shopping: ShoppingItem[];
}

export default function ShoppingForm({ userId, shopping }: ShoppingFormProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await api.createShoppingItem(userId, name.trim());
      setName('');
    } catch (error) {
      console.error('Failed to create shopping item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.toggleShoppingItem(id);
    } catch (error) {
      console.error('Failed to toggle shopping item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteShoppingItem(id);
    } catch (error) {
      console.error('Failed to delete shopping item:', error);
    }
  };

  const handleClearChecked = async () => {
    try {
      await api.clearCheckedItems();
    } catch (error) {
      console.error('Failed to clear checked items:', error);
    }
  };

  const pendingItems = shopping.filter(s => !s.checked);
  const checkedItems = shopping.filter(s => s.checked);

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add to Shopping List</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Milk, bread, eggs..."
            className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Shopping list */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Shopping List ({pendingItems.length})
          </h2>
          {checkedItems.length > 0 && (
            <button
              onClick={handleClearChecked}
              className="text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              Clear checked
            </button>
          )}
        </div>

        {pendingItems.length === 0 && checkedItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">Shopping list is empty</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl"
              >
                <button
                  onClick={() => handleToggle(item.id)}
                  className="w-6 h-6 border-2 border-slate-500 rounded-lg hover:border-green-500 transition-colors"
                />
                <span className="flex-1 text-white">{item.name}</span>
                {item.user_name && (
                  <span className="text-xs text-slate-500">{item.user_name}</span>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {checkedItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-slate-700/20 rounded-xl opacity-60"
              >
                <button
                  onClick={() => handleToggle(item.id)}
                  className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
                <span className="flex-1 text-slate-400 line-through">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
