import { Calendar, CheckSquare, ShoppingCart } from 'lucide-react';
import { Appointment, Todo, ShoppingItem } from '../../types';

interface MyItemsProps {
  appointments: Appointment[];
  todos: Todo[];
  shopping: ShoppingItem[];
}

export default function MyItems({ appointments, todos, shopping }: MyItemsProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);
  const pendingTodos = todos.filter(t => !t.completed);
  const pendingShopping = shopping.filter(s => !s.checked);

  return (
    <div className="space-y-4">
      {/* Today's appointments */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-primary-400" />
          <h3 className="font-medium text-white">Today's Appointments</h3>
        </div>
        {todayAppointments.length === 0 ? (
          <p className="text-slate-500 text-sm">No appointments today</p>
        ) : (
          <div className="space-y-2">
            {todayAppointments.map(apt => (
              <div key={apt.id} className="flex items-center gap-3 text-sm">
                <span className="text-primary-400 font-mono">{apt.time}</span>
                <span className="text-white">{apt.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending todos */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="w-5 h-5 text-amber-400" />
          <h3 className="font-medium text-white">My To-Dos</h3>
          <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
            {pendingTodos.length}
          </span>
        </div>
        {pendingTodos.length === 0 ? (
          <p className="text-slate-500 text-sm">All caught up! ✨</p>
        ) : (
          <div className="space-y-1">
            {pendingTodos.slice(0, 3).map(todo => (
              <p key={todo.id} className="text-sm text-slate-300 truncate">
                • {todo.title}
              </p>
            ))}
            {pendingTodos.length > 3 && (
              <p className="text-xs text-slate-500">+{pendingTodos.length - 3} more</p>
            )}
          </div>
        )}
      </div>

      {/* Shopping list preview */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="w-5 h-5 text-green-400" />
          <h3 className="font-medium text-white">Shopping List</h3>
          <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
            {pendingShopping.length}
          </span>
        </div>
        {pendingShopping.length === 0 ? (
          <p className="text-slate-500 text-sm">Shopping list is empty</p>
        ) : (
          <div className="space-y-1">
            {pendingShopping.slice(0, 3).map(item => (
              <p key={item.id} className="text-sm text-slate-300 truncate">
                • {item.name}
              </p>
            ))}
            {pendingShopping.length > 3 && (
              <p className="text-xs text-slate-500">+{pendingShopping.length - 3} more</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
