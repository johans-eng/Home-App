import { Activity, Home, MapPin, Calendar, CheckSquare, ShoppingCart, UserPlus } from 'lucide-react';
import { ActivityLog } from '../../types';

interface ActivityFeedProps {
  activity: ActivityLog[];
}

const getActivityIcon = (action: string) => {
  if (action.includes('status')) return action.includes('arrived') ? Home : MapPin;
  if (action.includes('appointment')) return Calendar;
  if (action.includes('todo')) return CheckSquare;
  if (action.includes('shopping')) return ShoppingCart;
  if (action.includes('joined')) return UserPlus;
  return Activity;
};

const getActivityColor = (action: string) => {
  if (action.includes('arrived') || action.includes('home')) return 'text-green-400 bg-green-500/20';
  if (action.includes('left') || action.includes('away')) return 'text-amber-400 bg-amber-500/20';
  if (action.includes('appointment')) return 'text-blue-400 bg-blue-500/20';
  if (action.includes('todo')) return 'text-purple-400 bg-purple-500/20';
  if (action.includes('shopping')) return 'text-cyan-400 bg-cyan-500/20';
  return 'text-slate-400 bg-slate-500/20';
};

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Activity</h2>
      </div>

      {activity.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
          {activity.map(item => {
            const Icon = getActivityIcon(item.action);
            const colorClass = getActivityColor(item.action);
            
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 animate-slide-up"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{item.details}</p>
                  <p className="text-xs text-slate-500">{formatTime(item.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
