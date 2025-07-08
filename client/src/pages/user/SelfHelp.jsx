import { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceCard from '../../components/resources/ResourceCard';
const base = import.meta.env.VITE_API_BASE_URL;

export default function SelfHelp() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('All');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${base}/api/resources`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(res.data);
    };
    fetch();
  }, []);

  const filtered = filter === 'All' ? resources : resources.filter(r => r.category === filter);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">💡 Self-Help Resource Library</h2>

      <div className="mb-4 flex gap-3">
        {['All', 'Video', 'Article', 'Exercise'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full border ${
              filter === cat
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 border-purple-400'
            } hover:scale-105 transition`}
          >
            {cat}s
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(res => <ResourceCard key={res._id} res={res} />)}
      </div>
    </div>
  );
}
