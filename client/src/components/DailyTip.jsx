import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DailyTip() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTip = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/tips/daily-tip');
      setTip(res.data.tip);
    } catch (err) {
      setTip("Did you know writing down 3 things you're grateful for improves mental clarity?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTip();
  }, []);

  return (
    <motion.div
      className="mt-10 bg-purple-100 text-purple-800 px-6 py-5 rounded-2xl shadow-md w-54 max-w-4xl mx-auto flex items-start gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      <Smile className="w-6 h-6 mt-1 text-purple-600" />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-lg">Tip of the Day</span>
          <button onClick={fetchTip} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-sm leading-relaxed italic">{tip}</p>
      </div>
    </motion.div>
  );
}
