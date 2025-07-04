import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function AdminUpload() {
    const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) return;
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    title: '',
    type: 'article',
    link: '',
    description: ''
  });
  const [resources, setResources] = useState([]);

  const fetchResources = async () => {
    const res = await axios.get('/api/selfhelp/all');
    setResources(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
    await axios.delete(`/api/selfhelp/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchResources();
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-4">🧘‍♂️ Admin Upload Panel</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg mb-8 space-y-4">
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
        <button className="bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700">Upload Resource</button>
      </form>

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
