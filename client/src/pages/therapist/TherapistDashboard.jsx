import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import StatCard from '../common/StatCard';
import { FaStar } from 'react-icons/fa';

export default function TherapistDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/bookings/therapist-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      {stats && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <StatCard label="Total Sessions" value={stats.totalSlots} />
            <StatCard label="Booked Sessions" value={stats.bookedSlots} />
            <StatCard label="Available Slots" value={stats.availableSlots} />
            <StatCard label="Unique Clients" value={stats.uniqueUsers} />
          </motion.div>

          {/* ⭐ Average Rating Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white border-l-4 border-yellow-400 shadow p-6 rounded-xl mb-6 flex items-center gap-4"
          >
            <FaStar className="text-yellow-400 text-4xl" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.avgRating ? `${stats.avgRating} / 5` : 'No Ratings Yet'}
              </h3>
              <p className="text-gray-600 text-sm">
                {stats.totalReviews} {stats.totalReviews === 1 ? 'Review' : 'Reviews'}
              </p>
            </div>
          </motion.div>
        </>
      )}

      <div className="p-6">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">Welcome to Your Therapist Dashboard</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/therapist/create-slot" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700">🕒 Create Availability</h3>
            <p className="text-gray-600 mt-2">Set your slots so users can book you.</p>
          </Link>

          <Link to="/therapist/appointments" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700">📋 View Bookings</h3>
            <p className="text-gray-600 mt-2">See who's booked sessions and when.</p>
          </Link>

          <Link to="/therapist/calendar" className="bg-white border-l-4 border-purple-500 shadow p-6 rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-purple-700">🗓 Calendar View</h3>
            <p className="text-gray-600 mt-2">Track your slots and bookings visually.</p>
          </Link>
        </div>
      </div>
    </>
  );
}
