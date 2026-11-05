import { Calendar, Clock } from 'lucide-react';
import { Appointment } from '../../types';

interface TodayAppointmentsProps {
  appointments: Appointment[];
}

export default function TodayAppointments({ appointments }: TodayAppointmentsProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments
    .filter(a => a.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcomingAppointments = appointments
    .filter(a => a.date > today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 3);

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
        <span className="ml-auto text-sm text-slate-400">
          {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {todayAppointments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No appointments today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todayAppointments.map(apt => (
            <div
              key={apt.id}
              className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-2 text-blue-400 min-w-[80px]">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">{apt.time}</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{apt.title}</p>
                <p className="text-sm text-slate-400">Added by {apt.user_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming */}
      {upcomingAppointments.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Coming Up</h3>
          <div className="space-y-2">
            {upcomingAppointments.map(apt => (
              <div key={apt.id} className="flex items-center gap-3 text-sm">
                <span className="text-slate-500 min-w-[90px]">
                  {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-slate-400">{apt.time}</span>
                <span className="text-slate-300 truncate">{apt.title}</span>
                <span className="text-slate-500 ml-auto">({apt.user_name})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
