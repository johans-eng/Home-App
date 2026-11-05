import { Users, Home, MapPin } from 'lucide-react';
import { User } from '../../types';

interface WhoIsHomeProps {
  users: User[];
}

export default function WhoIsHome({ users }: WhoIsHomeProps) {
  const homeUsers = users.filter(u => u.is_home);
  const awayUsers = users.filter(u => !u.is_home);

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-primary-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Who's Home</h2>
      </div>

      {/* Home */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">At Home ({homeUsers.length})</span>
        </div>
        {homeUsers.length === 0 ? (
          <p className="text-slate-500 text-sm pl-6">No one is home</p>
        ) : (
          <div className="space-y-2">
            {homeUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  {user.last_status_change && (
                    <p className="text-xs text-green-400">
                      Since {new Date(user.last_status_change).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Away */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-400">Away ({awayUsers.length})</span>
        </div>
        {awayUsers.length === 0 ? (
          <p className="text-slate-500 text-sm pl-6">Everyone is home!</p>
        ) : (
          <div className="space-y-2">
            {awayUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl"
              >
                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-slate-300 font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-slate-300 font-medium">{user.name}</p>
                  {user.last_status_change && (
                    <p className="text-xs text-slate-500">
                      Left at {new Date(user.last_status_change).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
