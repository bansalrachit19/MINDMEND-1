import { useMood } from '../../context/MoodContext';

export default function MoodSummaryWidget({ mood, lastChecked }) {
  const { setShowMoodModal } = useMood();

  const moodTips = {
    happy: "Keep up the positivity! Maybe share it with others 💜",
    self: "Try a breathing exercise or guided journal today 🌿",
    need: "Consider booking a session with a therapist 🤝",
    Unknown: "Take a moment to check your mood 🧠"
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold text-purple-700 mb-2">🧠 Your Mental Wellness Summary</h2>
      <p className="text-gray-700 mb-1">Current Mood Category: <strong>{(mood || 'Unknown').toUpperCase()}</strong></p>
      <p className="text-gray-700 mb-2">Last Checked: {lastChecked ? new Date(parseInt(lastChecked)).toLocaleDateString() : 'N/A'}</p>
      <p className="text-sm italic text-gray-600">{moodTips[mood] || moodTips.Unknown}</p>
      <button
        onClick={() => setShowMoodModal(true)}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
      >
        🧠 Re-check Mood
      </button>
    </div>
  );
}
