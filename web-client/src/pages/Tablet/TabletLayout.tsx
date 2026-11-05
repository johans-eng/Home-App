import { Home, LogOut, Calendar, CheckSquare, ShoppingCart, Activity } from 'lucide-react';
import { AppState, User } from '../../types';
import WhoIsHome from './WhoIsHome';
import TodayAppointments from './TodayAppointments';
import TodoList from './TodoList';
import ShoppingList from './ShoppingList';
import ActivityFeed from './ActivityFeed';

interface TabletLayoutProps {
  state: AppState;
  currentUser: User;
  onLogout: () => void;
}

export default function TabletLayout({ state, currentUser, onLogout }: TabletLayoutProps) {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Home Dashboard</h1>
            <p className="text-slate-400">{dateString}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white font-medium">{currentUser.name}</p>
            <p className="text-sm text-slate-400">
              {currentUser.is_home ? '🏠 At home' : '🚶 Away'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="p-3 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
            title="Switch user"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column - Who's Home */}
        <div className="col-span-3">
          <WhoIsHome users={state.users} />
        </div>

        {/* Center column - Appointments & Todos */}
        <div className="col-span-6 space-y-6">
          <TodayAppointments appointments={state.appointments} />
          <div className="grid grid-cols-2 gap-6">
            <TodoList todos={state.todos} />
            <ShoppingList shopping={state.shopping} />
          </div>
        </div>

        {/* Right column - Activity Feed */}
        <div className="col-span-3">
          <ActivityFeed activity={state.activity} />
        </div>
      </div>
    </div>
  );
}
