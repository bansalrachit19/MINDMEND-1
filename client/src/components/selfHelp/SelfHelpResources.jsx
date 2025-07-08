import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Book, PlayCircle, Heart, Brain, Dumbbell } from 'lucide-react';
const base = import.meta.env.VITE_API_BASE_URL;

const icons = {
  video: <PlayCircle className="text-purple-500 w-6 h-6" />,
  article: <Book className="text-purple-500 w-6 h-6" />,
  meditation: <Brain className="text-purple-500 w-6 h-6" />,
  guide: <Heart className="text-purple-500 w-6 h-6" />,
  exercise: <Dumbbell className="text-purple-500 w-6 h-6" />
};

export default function SelfHelpResources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get(`${base}/api/selfhelp/all`)
      .then(res => setResources(res.data.filter(r => r.approved)))
      .catch(err => console.error("Failed to load resources", err));
  }, []);

  if (resources.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">🌿 Self-Help Resources</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {resources.map((r, i) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-md p-5 border border-purple-100 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              {icons[r.type]}
              <h3 className="text-lg font-semibold text-purple-800">{r.title}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">{r.description}</p>
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-purple-600 font-medium hover:underline"
            >
              Open Resource →
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
