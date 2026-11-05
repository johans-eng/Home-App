import { useState } from 'react';
import { Home, Calendar, CheckSquare, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { AppState, User } from '../../types';
import StatusToggle from './StatusToggle';
import AppointmentForm from './AppointmentForm';
import TodoForm from './TodoForm';
import ShoppingForm from './ShoppingForm';
import MyItems from './MyItems';

interface PhoneLayoutProps {
  state: AppState;
  currentUser: User;
  onLogout: () => void;
}

type Tab = 'home' | 'appointments' | 'todos' | 'shopping';

export default function PhoneLayout({ state, currentUser, onLogout }: PhoneLayoutProps) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col safe-top safe-bottom">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {currentUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-white font-semibold">{currentUser.name}</h1>
            <p className="text-xs text-slate-400">
              {currentUser.is_home ? '🏠 At home' : '🚶 Away'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Menu overlay */}
      {showMenu && (
        <div className="absolute top-16 right-4 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-20 animate-slide-up">
          <button
            onClick={() => {
              onLogout();
              setShowMenu(false);
            }}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-700/50 w-full rounded-xl"
          >
            <LogOut className="w-5 h-5" />
            <span>Switch user</span>
          </button>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <StatusToggle user={currentUser} />
            <MyItems 
              appointments={state.appointments.filter(a => a.user_id === currentUser.id)}
              todos={state.todos.filter(t => t.user_id === currentUser.id)}
              shopping={state.shopping.filter(s => s.user_id === currentUser.id)}
            />
          </div>
        )}
        {activeTab === 'appointments' && (
          <AppointmentForm userId={currentUser.id} appointments={state.appointments} />
        )}
        {activeTab === 'todos' && (
          <TodoForm userId={currentUser.id} todos={state.todos} />
        )}
        {activeTab === 'shopping' && (
          <ShoppingForm userId={currentUser.id} shopping={state.shopping} />
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 px-2 py-2 safe-bottom">
        <div className="flex justify-around">
          {[
            { id: 'home' as Tab, icon: Home, label: 'Home' },
            { id: 'appointments' as Tab, icon: Calendar, label: 'Calendar' },
            { id: 'todos' as Tab, icon: CheckSquare, label: 'To-Dos' },
            { id: 'shopping' as Tab, icon: ShoppingCart, label: 'Shopping' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-400 bg-primary-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
