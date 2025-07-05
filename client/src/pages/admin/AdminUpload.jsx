import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function AdminUpload() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    type: 'article',
    link: '',
    description: ''
  });
  const [resources, setResources] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user === null) return;
    if (!user?.isAdmin) navigate('/');
  }, [user, navigate]);

  const fetchResources = async () => {
    try {
      const res = await axios.get('/api/selfhelp/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const all = res.data;
      setResources(all.filter(r => r.approved));
      setAiSuggestions(all.filter(r => r.isAI && !r.approved));
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/selfhelp/upload', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ title: '', type: 'article', link: '', description: '' });
      fetchResources();
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/selfhelp/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchResources();
  };

  const handleApprove = async (id) => {
    await axios.put(`/api/selfhelp/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchResources();
  };

  const handleAISuggestion = async (category) => {
    setLoading(true);
    await axios.post('/api/selfhelp/ai-suggest', { category }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLoading(false);
    fetchResources();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">🧘‍♀️ Admin Upload & AI Suggestion Panel</h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl mb-8 space-y-4">
        <h3 className="text-xl font-semibold text-purple-600">📤 Upload New Resource</h3>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
          className="w-full p-3 rounded-xl border border-gray-300"
        />
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          className="w-full p-3 rounded-xl border border-gray-300"
        >
          <option value="video">Video</option>
          <option value="article">Article</option>
          <option value="guide">Guide</option>
          <option value="meditation">Meditation</option>
          <option value="exercise">Exercise</option>
        </select>
        <input
          type="text"
          placeholder="Link (URL)"
          value={form.link}
          onChange={e => setForm({ ...form, link: e.target.value })}
          required
          className="w-full p-3 rounded-xl border border-gray-300"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full p-3 rounded-xl border border-gray-300"
        ></textarea>
        <button className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 transition">
          Upload Resource
        </button>
      </form>

      {/* AI Suggestions */}
      <div className="bg-purple-50 p-6 rounded-2xl shadow-xl mb-8">
        <h3 className="text-xl font-semibold text-purple-700 mb-3">🧠 AI Suggestions</h3>

        <div className="flex gap-4 mb-4">
          {['happy', 'self', 'need'].map(category => (
            <button
              key={category}
              onClick={() => handleAISuggestion(category)}
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-xl"
              disabled={loading}
            >
              Generate for {category.toUpperCase()}
            </button>
          ))}
        </div>

        {aiSuggestions.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiSuggestions.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-purple-800">{r.title} ({r.type})</h4>
                <p className="text-sm text-gray-600 mb-2">{r.description}</p>
                <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">View</a>
                <button
                  onClick={() => handleApprove(r._id)}
                  className="mt-2 w-full bg-green-600 text-white py-1 rounded-xl hover:bg-green-700 transition"
                >
                  ✅ Approve
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No pending AI suggestions</p>
        )}
      </div>

      {/* Existing Resources */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">🗂 Uploaded Resources</h3>
      <ul className="space-y-4">
        {resources.map((r) => (
          <li key={r._id} className="bg-gray-100 p-4 rounded-xl shadow-sm flex justify-between items-center">
            <div>
              <h4 className="font-bold text-purple-700">{r.title} ({r.type})</h4>
              <p className="text-sm text-gray-600">{r.description}</p>
              <a href={r.link} className="text-blue-600 underline" target="_blank" rel="noreferrer">View Resource</a>
            </div>
            <button
              onClick={() => handleDelete(r._id)}
              className="text-red-500 font-bold hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
