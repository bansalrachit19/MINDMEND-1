import { useState } from 'react';
import axios from 'axios';
const base = import.meta.env.VITE_API_BASE_URL;

export default function CreateSlot() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);

  const createSlot = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${base}/api/bookings/slot`, { date, time, duration }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Slot created');
      setDate('');
      setTime('');
      setDuration('30');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl shadow-xl animate-fade-in">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Create Therapy Slot</h2>
      <div className="flex flex-col gap-4">
        <input type="date" className="p-3 rounded-xl border" value={date} onChange={e => setDate(e.target.value)} />
        <input type="time" className="p-3 rounded-xl border" value={time} onChange={e => setTime(e.target.value)} />
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="p-3 rounded-xl border bg-white"
        >
          <option value="30">30 minutes</option>
          <option value="60">60 minutes</option>
        </select>
        <button
          onClick={createSlot}
          disabled={loading}
          className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition"
        >
          {loading ? 'Creating...' : 'Create Slot'}
        </button>
      </div>
    </div>
  );
}
