// src/components/user/HappyRecommendations.jsx
import { useMood } from '../../context/MoodContext';

export default function HappyRecommendations() {
  const { moodCategory } = useMood();

  if (!moodCategory) return null; // Don't show anything if mood isn't set

  const content = {
    happy: {
      title: "🎉 You seem happy today!",
      message: "Keep spreading positivity! Try meditation or journaling.",
    },
    self: {
      title: "💪 You're doing okay.",
      message: "Consider some self-care today like a short walk, hydration, or deep breathing.",
    },
    need: {
      title: "🛑 You may need support.",
      message: "Please don't hesitate to reach out. Explore our therapy section or talk to someone you trust.",
    }
  };

  const { title, message } = content[moodCategory] || content.happy;

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <h3 className="text-xl font-semibold text-purple-600">{title}</h3>
      <p className="text-gray-600 mt-2">{message}</p>
    </div>
  );
}
