import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const base = import.meta.env.VITE_API_BASE_URL;

import MoodSummaryWidget from '../components/user/MoodSummaryWidget';
import HappyRecommendations from '../components/user/HappyRecommendations';
import TherapistRecommendations from '../components/user/TherapistRecommendations';
import SelfHealTools from '../components/user/SelfHealTools';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        return;
      }

      try {
        const response = await axios.get(`${base}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Authentication error", error);
        logout();
      }
    };

    fetchUserData();
  }, []);

  const moodCategory = localStorage.getItem('moodCategory');
  const lastMoodCheck = localStorage.getItem('lastMoodCheck');

  return (
    <div className="min-h-screen bg-indigo-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {user ? (
          <>
            <div className="bg-white shadow-md rounded-xl p-6 text-center mb-6">
              <h1 className="text-3xl font-bold text-indigo-600">Welcome, {user.name} 👋</h1>
              <p className="mt-2 text-gray-500">Role: {user.role}</p>
              <button
                onClick={logout}
                className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>

            {/* Mood Summary */}
            <MoodSummaryWidget mood={moodCategory} lastChecked={lastMoodCheck} />

            {/* Personalized Recommendations */}
            <div className="mt-6">
              {moodCategory === 'happy' && <HappyRecommendations />}
              <TherapistRecommendations mood={moodCategory} />
              <SelfHealTools mood={moodCategory} />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
}
