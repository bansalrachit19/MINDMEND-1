import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
const base = import.meta.env.VITE_API_BASE_URL;

const moodLabels = {
  happy: '😊 Happy',
  sad: '😢 Sad',
  anxious: '😰 Anxious',
  angry: '😡 Angry',
  neutral: '😐 Neutral',
  excited: '🤩 Excited'
};

const moodColors = {
  happy: '#7c3aed',
  sad: '#6366f1',
  anxious: '#ec4899',
  angry: '#f87171',
  neutral: '#9ca3af',
  excited: '#22c55e'
};

export default function MoodHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${base}/api/mood/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sorted = [...res.data].reverse();
      setHistory(sorted);
    };
    fetchHistory();
  }, []);

  const chartData = history.map((entry, idx) => ({
    name: dayjs(entry.date).format('MMM D'),
    mood: entry.mood,
    moodValue: Object.keys(moodLabels).indexOf(entry.mood)
  }));

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-10 p-6 bg-purple-50 rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">📈 Mood History & Trends</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(val) => moodLabels[Object.keys(moodLabels)[val]]?.split(' ')[1]}
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
          />
          <Tooltip
            formatter={(value, name, props) =>
              moodLabels[Object.keys(moodLabels)[value]]
            }
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="moodValue"
            stroke="#7c3aed"
            strokeWidth={3}
            dot={{ stroke: '#7c3aed', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-purple-700 mb-4">📝 Mood Logs</h3>
        <ul className="space-y-3">
          {history.map((entry) => (
            <li key={entry._id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
              <div>
                <p className="text-lg">
                  {moodLabels[entry.mood]} – <span className="text-gray-600 text-sm">{dayjs(entry.date).format('DD MMM YYYY')}</span>
                </p>
                {entry.note && <p className="text-gray-500 mt-1 italic">"{entry.note}"</p>}
              </div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: moodColors[entry.mood] }}
              ></div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
