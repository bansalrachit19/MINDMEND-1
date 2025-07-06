// src/components/user/MoodAssessmentModal.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useMood } from '../../context/MoodContext';

const questions = [
  { id: 1, q: "How have you been sleeping lately?", weight: { happy: 0, self: 1, need: 2 } },
  { id: 2, q: "Do you feel overwhelmed during the day?", weight: { happy: 0, self: 1, need: 2 } },
  { id: 3, q: "Have you lost interest in hobbies?", weight: { happy: 0, self: 1, need: 2 } },
  { id: 4, q: "Do you feel motivated most mornings?", weight: { happy: 2, self: 1, need: 0 } },
  { id: 5, q: "Do you experience frequent anxiety or panic?", weight: { happy: 0, self: 1, need: 2 } },
  { id: 6, q: "Are you struggling to focus or concentrate?", weight: { happy: 0, self: 1, need: 2 } },
  { id: 7, q: "Have you had thoughts of self-harm or feeling hopeless?", weight: { happy: 0, self: 0, need: 3 } },
  { id: 8, q: "Do you feel supported by those around you?", weight: { happy: 2, self: 1, need: 0 } }
];

export default function MoodAssessmentModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ happy: 0, self: 0, need: 0 });
  const [visible, setVisible] = useState(true);
  const { updateMoodSummary } = useMood();

  const handleAnswer = async (choice) => {
    const newScores = { ...scores };
    const weights = questions[step].weight;

    for (let category in weights) {
      newScores[category] += choice === 'yes' ? weights[category] : 0;
    }
    setScores(newScores);

    // Move to next question or finish
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      const finalCategory = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      const token = localStorage.getItem('token');
      const now = Date.now();

      try {
        await axios.post(
          '/api/mood/save',
          {
            answers: newScores,
            score: Math.max(...Object.values(newScores)),
            category: finalCategory
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Update context and localStorage
        updateMoodSummary(finalCategory, now);

        toast.success("✅ Mood saved successfully!");
        setVisible(false);

        if (onComplete) onComplete(); // Callback for parent

      } catch (error) {
        console.error("❌ Error saving mood:", error);
        toast.error("Failed to save your mood. Try again.");
        if (onComplete) onComplete();
      }
    }
  };

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-2xl font-bold text-purple-700 mb-4">🧠 Mental Wellness Check-In</h3>
        <p className="text-lg text-gray-700 mb-6">{questions[step].q}</p>

        <div className="flex justify-center gap-6">
          <button
            className="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700"
            onClick={() => handleAnswer('yes')}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-xl hover:bg-gray-400"
            onClick={() => handleAnswer('no')}
          >
            No
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-400">{step + 1} / {questions.length}</p>
      </motion.div>
    </motion.div>
  );
}
