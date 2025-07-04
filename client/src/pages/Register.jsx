import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SPECIALIZATIONS = [
  'Addiction',
  'Behavioral',
  'Child',
  'Clinical',
  'Cognitive',
  'Eating Disorder',
  'Exercise',
  'Trauma',
  'Anxiety',
  'Grief',
  'Sleep'
];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    specialization: []
  });

  const navigate = useNavigate();

  const handleSpecializationChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const updated = new Set(prev.specialization);
      if (checked) updated.add(value);
      else updated.delete(value);
      return { ...prev, specialization: Array.from(updated) };
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-emerald-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-emerald-600">MindMend Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="therapist">Therapist</option>
            <option value="admin">Admin</option>
          </select>

          {/* Specialization for therapists only */}
          {form.role === 'therapist' && (
            <div>
              <label className="block mb-2 font-medium text-gray-700">Select Specializations</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {SPECIALIZATIONS.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      value={spec}
                      checked={form.specialization.includes(spec)}
                      onChange={handleSpecializationChange}
                      className="accent-purple-500"
                    />
                    <span>{spec} Therapist</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <a href="/" className="text-emerald-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
