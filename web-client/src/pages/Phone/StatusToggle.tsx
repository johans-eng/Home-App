import { useState } from 'react';
import { Home, MapPin } from 'lucide-react';
import { User } from '../../types';
import { api } from '../../hooks/useApi';

interface StatusToggleProps {
  user: User;
}

export default function StatusToggle({ user }: StatusToggleProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await api.setStatus(user.id, !user.is_home);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const isHome = !!user.is_home;

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Your Status</h2>
      
      <div className="flex gap-3">
        <button
          onClick={handleToggle}
          disabled={loading || isHome}
          className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
            isHome
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
          } ${loading ? 'opacity-50' : ''}`}
        >
          <Home className="w-8 h-8" />
          <span className="font-medium">Home</span>
        </button>
        
        <button
          onClick={handleToggle}
          disabled={loading || !isHome}
          className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
            !isHome
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
          } ${loading ? 'opacity-50' : ''}`}
        >
          <MapPin className="w-8 h-8" />
          <span className="font-medium">Away</span>
        </button>
      </div>

      {user.last_status_change && (
        <p className="text-center text-sm text-slate-500 mt-4">
          Since {new Date(user.last_status_change).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  );
}
