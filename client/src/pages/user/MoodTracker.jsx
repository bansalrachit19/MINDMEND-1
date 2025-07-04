import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const moods = [
  { type: 'happy', emoji: '😄' },
  { type: 'sad', emoji: '😢' },
  { type: 'anxious', emoji: '😰' },
  { type: 'angry', emoji: '😡' },
  { type: 'neutral', emoji: '😐' },
  { type: 'excited', emoji: '🤩' }
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const submitMood = async () => {
    try {
      if (!selectedMood) {
        setError('Please select a mood');
        return;
      }
      const token = localStorage.getItem('token');
      await axios.post('/api/mood/log', {
        mood: selectedMood,
        note
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Mood logged successfully!');
      setTimeout(() => navigate('/user'), 1000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-10 p-8 bg-purple-50 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">🧠 How are you feeling today?</h2>

      <div className="grid grid-cols-3 gap-4 justify-items-center mb-6">
        {moods.map((mood) => (
          <button
            key={mood.type}
            className={`text-4xl p-3 rounded-full border-2 hover:scale-110 transition ${
              selectedMood === mood.type ? 'border-purple-600' : 'border-transparent'
            }`}
            onClick={() => setSelectedMood(mood.type)}
          >
            {mood.emoji}
          </button>
        ))}
      </div>

      <textarea
        className="w-full p-3 border rounded-xl resize-none focus:outline-none"
        placeholder="Add a note (optional)..."
        rows={4}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}

      <button
        onClick={submitMood}
        className="mt-4 w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
      >
        Submit Mood
      </button>
    </motion.div>
  );
}
