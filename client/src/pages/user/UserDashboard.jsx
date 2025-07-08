import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import MoodAssessmentModal from '../../components/user/MoodAssessmentModal';
import HappyRecommendations from '../../components/user/HappyRecommendations';
import SelfHealTools from '../../components/user/SelfHealTools';
import TherapistRecommendations from '../../components/user/TherapistRecommendations';
import MoodSummaryWidget from '../../components/mood/MoodSummaryWidget';
import SelfHelpResources from '../../components/selfHelp/SelfHelpResources';
import { Book, PlayCircle, Heart, Brain, Dumbbell } from 'lucide-react';
import { useMood } from '../../context/MoodContext';
const base = import.meta.env.VITE_API_BASE_URL;

export default function UserDashboard() {
  const {moodCategory} = useMood();
  const [category, setCategory] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [showModal, setShowModal] = useState(() => {
    const last = localStorage.getItem('lastMoodCheck');
    return !last || (Date.now() - parseInt(last)) > 24 * 60 * 60 * 1000;
  });
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [personalized, setPersonalized] = useState([]);

  const emergencyData = [
    {
      name: "iCall - TISS",
      description: "24x7 free professional mental health helpline (PAN India)",
      phone: "9152987821",
      website: "https://icallhelpline.org/",
    },
    {
      name: "AASRA",
      description: "Mumbai-based suicide prevention helpline",
      phone: "9820466726",
      website: "http://www.aasra.info/",
    },
    {
      name: "Vandrevala Foundation Helpline",
      description: "Mental health and crisis support, multilingual",
      phone: "18602662345",
      website: "https://vandrevalafoundation.com/",
    },
  ];

  useEffect(() => {
    const cat = localStorage.getItem('moodCategory');
    const time = localStorage.getItem('lastMoodCheck');
    if (cat) setCategory(cat);
    if (time) setLastChecked(parseInt(time));
  }, []);

  const handleAssessmentComplete = (cat, timestamp) => {
    localStorage.setItem('moodCategory', cat);
    localStorage.setItem('lastMoodCheck', timestamp.toString());
    setCategory(cat);
    setLastChecked(timestamp);
    setShowModal(false);
  };

  const icons = {
    video: <PlayCircle className="text-purple-500 w-6 h-6" />,
    article: <Book className="text-purple-500 w-6 h-6" />,
    meditation: <Brain className="text-purple-500 w-6 h-6" />,
    guide: <Heart className="text-purple-500 w-6 h-6" />,
    exercise: <Dumbbell className="text-purple-500 w-6 h-6" />
  };

  useEffect(() => {
    const fetchPersonalized = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${base}/api/selfhelp/user-matches`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {mood: moodCategory}
        });
        setPersonalized(res.data);
      } catch (err) {
        console.error('Failed to fetch personalized resources:', err);
      }
    };

    fetchPersonalized();
  }, [moodCategory]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-purple-700">Welcome to Your Wellness Dashboard</h2>
        <button
          onClick={() => setShowEmergencyModal(true)}
          className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
        >
          🚨 Emergency Help
        </button>
      </div>

      <motion.div
        key={`${category}-${lastChecked}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <MoodSummaryWidget mood={category} lastChecked={lastChecked} />
      </motion.div>

      {showModal && <MoodAssessmentModal onComplete={handleAssessmentComplete} />}

      {moodCategory === 'happy' && <HappyRecommendations />}
      {moodCategory === 'self' && <SelfHealTools />}
      {moodCategory === 'need' && <TherapistRecommendations />}

      {personalized.length === 0 && (
        <div className="mt-10 text-gray-600 italic">
          No personalized resources yet. Try logging your mood to get tailored suggestions!
        </div>
      )}

      {personalized.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4">🧘 Personalized Self-Help Picks</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalized.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-2xl shadow-md border border-purple-100 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  {icons[r.type] || <Book className="text-purple-500 w-6 h-6" />}
                  <h4 className="font-bold text-purple-800 text-lg">{r.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{r.description}</p>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-purple-600 font-medium hover:underline text-sm"
                >
                  View Resource →
                </a>
              </motion.div>
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
          <h3 className="text-xl font-semibold text-purple-700">🗖️ Calendar View</h3>
          <p className="text-gray-600 mt-2">See available therapist slots visually.</p>
        </Link>

        <Link to="/user/mood-history" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700">📈 Mood History</h3>
          <p className="text-gray-600 mt-2">See your mood trends over time.</p>
        </Link>

        <Link to="/user/breathing" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-purple-700">🌬️ Breathing Exercise</h3>
          <p className="text-gray-600 mt-2">Calm your mind with guided breathing animations.</p>
        </Link>
      </div>

      <SelfHelpResources />

      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold text-red-600 mb-4">Emergency Help</h2>
            <p className="text-gray-700 mb-4">
              If you're in crisis or need immediate support, please reach out to one of the trusted helplines below:
            </p>
            <ul className="space-y-4 text-sm text-gray-800">
              {emergencyData.map((item, index) => (
                <li key={index} className="border-b pb-3">
                  <h3 className="font-semibold text-purple-700">{item.name}</h3>
                  <p>{item.description}</p>
                  <p>
                    📞 <a href={`tel:${item.phone}`} className="text-blue-600 hover:underline">{item.phone}</a>
                  </p>
                  <p>
                    🌐 <a href={item.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{item.website}</a>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
