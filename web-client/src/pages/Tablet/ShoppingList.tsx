import { ShoppingCart, Check } from 'lucide-react';
import { ShoppingItem } from '../../types';
import { api } from '../../hooks/useApi';

interface ShoppingListProps {
  shopping: ShoppingItem[];
}

export default function ShoppingList({ shopping }: ShoppingListProps) {
  const pendingItems = shopping.filter(s => !s.checked);
  const checkedItems = shopping.filter(s => s.checked);

  const handleToggle = async (id: string) => {
    try {
      await api.toggleShoppingItem(id);
    } catch (error) {
      console.error('Failed to toggle shopping item:', error);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-green-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Shopping</h2>
        <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
          {pendingItems.length} items
        </span>
      </div>

      {pendingItems.length === 0 && checkedItems.length === 0 ? (
        <div className="text-center py-6">
          <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500">List is empty</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {pendingItems.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl group"
            >
              <button
                onClick={() => handleToggle(item.id)}
                className="w-5 h-5 border-2 border-slate-500 rounded group-hover:border-green-500 transition-colors flex-shrink-0"
              />
              <span className="text-white text-sm flex-1 truncate">{item.name}</span>
              {item.quantity > 1 && (
                <span className="text-xs text-slate-400">x{item.quantity}</span>
              )}
              <span className="text-xs text-slate-500">{item.user_name}</span>
            </div>
          ))}

          {checkedItems.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-slate-700/20 rounded-xl opacity-50"
            >
              <button
                onClick={() => handleToggle(item.id)}
                className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0"
              >
                <Check className="w-3 h-3 text-white" />
              </button>
              <span className="text-slate-400 text-sm line-through truncate">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
