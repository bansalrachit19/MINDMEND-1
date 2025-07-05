import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function TherapistChats() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/messages/partners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPartners(res.data);
    };
    fetchPartners();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">👥 Your Chat Clients</h2>
      {partners.length === 0 ? (
        <p>No booked clients yet.</p>
      ) : (
        <ul className="space-y-4">
          {partners.map(user => (
            <li key={user._id} className="bg-white shadow p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Link
                  to={`/chat?therapist=${user._id}`}
                  className="bg-purple-600 text-white px-4 py-2 rounded-full"
                >
                  Message
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
