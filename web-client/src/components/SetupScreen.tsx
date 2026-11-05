import { useState } from 'react';
import { Home, User as UserIcon, Plus } from 'lucide-react';
import { User } from '../types';

interface SetupScreenProps {
  users: User[];
  onCreateUser: (name: string) => void;
  onSelectUser: (userId: string) => void;
  isTablet: boolean;
}

export default function SetupScreen({ users, onCreateUser, onSelectUser, isTablet }: SetupScreenProps) {
  const [name, setName] = useState('');
  const [showCreate, setShowCreate] = useState(users.length === 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateUser(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 safe-top safe-bottom">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Home App</h1>
          <p className="text-slate-400 mt-2">
            {isTablet ? 'Family Dashboard' : 'Stay connected with your home'}
          </p>
        </div>

        {/* Existing users */}
        {users.length > 0 && !showCreate && (
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 mb-4">
            <h2 className="text-lg font-semibold text-white mb-4">Who are you?</h2>
            <div className="space-y-2">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user.id)}
                  className="w-full flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium">{user.name}</span>
                  {user.is_home ? (
                    <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      Home
                    </span>
                  ) : (
                    <span className="ml-auto text-xs bg-slate-600/50 text-slate-400 px-2 py-1 rounded-full">
                      Away
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-600 hover:border-primary-500 rounded-xl text-slate-400 hover:text-primary-400 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add new person</span>
            </button>
          </div>
        )}

        {/* Create new user */}
        {(showCreate || users.length === 0) && (
          <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {users.length === 0 ? 'Create your profile' : 'Add new person'}
            </h2>
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Your name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  autoFocus
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              Continue
            </button>
            {users.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="w-full mt-2 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Back to user list
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
