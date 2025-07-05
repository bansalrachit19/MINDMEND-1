import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MoodAssessmentModal from '../../components/user/MoodAssessmentModal';
import HappyRecommendations from '../../components/user/HappyRecommendations';
import SelfHealTools from '../../components/user/SelfHealTools';
import TherapistRecommendations from '../../components/user/TherapistRecommendations';
import MoodSummaryWidget from '../../components/mood/MoodSummaryWidget';
import SelfHelpResources from '../../components/selfHelp/SelfHelpResources';

export default function UserDashboard() {
  const [category, setCategory] = useState(() => {
    const stored = localStorage.getItem('moodCategory');
    return stored && stored !== 'null' ? stored : null;
  });

  const [showModal, setShowModal] = useState(() => {
    const last = localStorage.getItem('lastMoodCheck');
    return !last || (Date.now() - parseInt(last)) > 24 * 60 * 60 * 1000;
  });

  const [personalized, setPersonalized] = useState([]);

  const handleAssessmentComplete = (cat) => {
    setCategory(cat);
    localStorage.setItem('moodCategory', cat);
    localStorage.setItem('lastMoodCheck', Date.now().toString());
    setShowModal(false);
  };

  useEffect(() => {
    const fetchPersonalized = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("🚫 No token found. Skipping personalized fetch.");
        return;
      }

      try {
        const res = await axios.get('/api/selfhelp/user-matches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPersonalized(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch personalized resources:', err);
      }
    };

    fetchPersonalized();
  }, []);


  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Welcome to Your Wellness Dashboard</h2>

      <MoodSummaryWidget
        mood={category}
        lastChecked={localStorage.getItem('lastMoodCheck')}
      />

      {showModal && <MoodAssessmentModal onComplete={handleAssessmentComplete} />}

      {category === 'happy' && <HappyRecommendations />}
      {category === 'self' && <SelfHealTools />}
      {category === 'need' && <TherapistRecommendations />}

      {personalized.length === 0 && (
        <div className="mt-10 text-gray-600 italic">
          No personalized resources yet. Try logging your mood to get tailored suggestions!
        </div>
      )}
      {personalized.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4">🧘 Personalized Self-Help Picks</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalized.map(r => (
              <div key={r._id} className="bg-white p-4 rounded-2xl shadow-lg border">
                <h4 className="font-bold text-purple-800 mb-1">{r.title} ({r.type})</h4>
                <p className="text-sm text-gray-600 mb-2">{r.description}</p>
                <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                  View Resource ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 pt-10">
        <Link to="/user/book" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700">📅 Book Therapy</h3>
          <p className="text-gray-600 mt-2">Browse therapist slots and book a session.</p>
        </Link>

        <Link to="/user/appointments" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700">🗂 View My Sessions</h3>
          <p className="text-gray-600 mt-2">Check your past and upcoming therapy appointments.</p>
        </Link>

        <Link to="/user/mood" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700">🧠 Mood Tracker</h3>
          <p className="text-gray-600 mt-2">Log your daily mood & thoughts.</p>
        </Link>

        <Link to="/user/calendar" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700">📆 Calendar View</h3>
          <p className="text-gray-600 mt-2">See available therapist slots visually.</p>
        </Link>

        <Link to="/user/mood-history" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700">📈 Mood History</h3>
          <p className="text-gray-600 mt-2">See your mood trends over time.</p>
        </Link>
      </div>

      <SelfHelpResources />
    </div>
  );
}
