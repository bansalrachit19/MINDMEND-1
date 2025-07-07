import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function TherapistRecommendations() {
  const [therapists, setTherapists] = useState([]);

  "Addiction",
  "Behavioral",
  "Child",
  "Clinical",
  "Cognitive",
  "Eating Disorder",
  "Exercise",
  "Trauma",
  "Anxiety",
  "Grief",
  "Sleep",

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.post(
          '/api/users/match-therapists',
          { keywords: ['Addiction', 'Behavioral', 'Child', 'Clinical', 'Cognitive', 'Eating Disorder', 'Exercise', 'Trauma', 'Anxiety', 'Grief', 'Sleep'] }, // TODO: Replace with real dynamic keywords
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTherapists(res.data);
      } catch (err) {
        console.error("🧠 Error fetching matched therapists:", err);
      }
    };
    fetch();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow mt-6"
    >
      <h3 className="text-2xl font-bold text-purple-700 mb-4">🧑‍⚕️ We Recommend These Therapists for You</h3>

      {therapists.length === 0 ? (
        <p className="text-gray-500 italic">
          No therapists matched your emotional needs yet. Try updating your mood check or browse all therapists from the booking page.
        </p>
      ) : (
        <ul className="space-y-4">
          {therapists.map((t) => (
            <li key={t._id} className="border p-4 rounded-xl flex justify-between items-center hover:shadow transition">
              <div>
                <h4 className="text-lg font-semibold text-purple-800">{t.name}</h4>
                <p className="text-sm text-gray-600">
                  Specializations: {t.specialization.join(', ')}
                </p>
              </div>
              <a
                href="/user/appointments"
                className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
              >
                Book
              </a>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
