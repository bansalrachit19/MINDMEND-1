import { Link } from 'react-router-dom';
import MoodAssessmentModal from '../../components/user/MoodAssessmentModal';
import { useState, useEffect } from 'react';
import HappyRecommendations from '../../components/user/HappyRecommendations';
import SelfHealTools from '../../components/user/SelfHealTools';
import TherapistRecommendations from '../../components/user/TherapistRecommendations';
import MoodSummaryWidget from '../../components/mood/MoodSummaryWidget';
import SelfHelpResources from '../../components/selfHelp/SelfHelpResources';
import { useUser } from '../../context/UserContext';
import { useMood } from '../../context/MoodContext';

export default function UserDashboard() {
    const userData = localStorage.getItem('user');
    const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;
    const [category, setCategory] = useState(null);
    const [showModal, setShowModal] = useState(() => {
        const last = localStorage.getItem('lastMoodCheck');
        return !last || (Date.now() - parseInt(last)) > 24 * 60 * 60 * 1000;
    });
    const [showMoodModal, setShowMoodModal] = useState(false);

    useEffect(() => {
    const userData = localStorage.getItem('user');
    try {
        const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;
        if (user) {
        const last = new Date(user.lastMoodCheck);
        const daysSince = (Date.now() - last.getTime()) / (1000 * 3600 * 24);
        if (!user.hasFilledMood || daysSince > 7) {
            setShowMoodModal(true);
        }
        }
    } catch (err) {
        console.error("Failed to parse user from localStorage", err);
    }
    }, []);


    const handleAssessmentComplete = (cat) => {
        setCategory(cat);
        setShowModal(false);
        localStorage.setItem('lastMoodCheck', Date.now().toString());
    };

  return (
    <div className="p-6">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">Welcome to Your Wellness Dashboard</h2>
        <MoodSummaryWidget user={user} />

        {showModal && <MoodAssessmentModal onComplete={handleAssessmentComplete} />}

        {category === 'happy' && (
            <HappyRecommendations />
        )}

        {category === 'self' && (
            <SelfHealTools />
        )}

        {category === 'need' && (
            <TherapistRecommendations />
        )}

      <div className="grid md:grid-cols-2 gap-6 pt-4">
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
