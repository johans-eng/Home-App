import { useState } from 'react';
import { Plus, Calendar, Clock, Trash2 } from 'lucide-react';
import { Appointment } from '../../types';
import { api } from '../../hooks/useApi';

interface AppointmentFormProps {
  userId: string;
  appointments: Appointment[];
}

export default function AppointmentForm({ userId, appointments }: AppointmentFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await api.createAppointment(userId, title.trim(), date, time);
      setTitle('');
    } catch (error) {
      console.error('Failed to create appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteAppointment(id);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  const myAppointments = appointments
    .filter(a => a.user_id === userId)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Doctor's appointment..."
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim() || loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Appointment
          </button>
        </form>
      </div>

      {/* My appointments */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">My Appointments</h2>
        {myAppointments.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No appointments yet</p>
        ) : (
          <div className="space-y-3">
            {myAppointments.map(apt => (
              <div
                key={apt.id}
                className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{apt.title}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(apt.date).toLocaleDateString()} at {apt.time}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(apt.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
