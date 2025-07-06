import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [show, setShow] = useState(true);

  const answer = async (type) => {
    const newScores = { ...scores };
    const weights = questions[step].weight;
    Object.keys(weights).forEach(k => {
      newScores[k] += type === 'yes' ? weights[k] : 0;
    });
    setScores(newScores);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      const finalCategory = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      //setShow(false);

      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/mood/save', {
          answers: newScores,
          score: Math.max(...Object.values(newScores)),
          category: finalCategory
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // 🎯 Update LocalStorage Safely
        const raw = localStorage.getItem('user');
        if (raw && raw !== 'undefined') {
          const updated = JSON.parse(raw);
          updated.hasFilledMood = true;
          updated.lastMoodCheck = new Date().toISOString();
          localStorage.setItem('user', JSON.stringify(updated));
        } else {
          console.warn("⚠️ No valid 'user' found in localStorage.");
        }

        const now = Date.now();
        localStorage.setItem('moodCategory', finalCategory);
        localStorage.setItem('lastMoodCheck', now.toString());
        onComplete(finalCategory, now);
        toast.success("✅ Mood logged successfully!");
        //setShow(false);

      } catch (err) {
        console.error("❌ Failed to save mood data", err);
        onComplete(finalCategory); // Still proceed
      }
    }
  };

  if (!show) return null;

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
            onClick={() => answer('yes')}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-xl hover:bg-gray-400"
            onClick={() => answer('no')}
          >
            No
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-400">{step + 1} / {questions.length}</p>
      </motion.div>
    </motion.div>
  );
}
