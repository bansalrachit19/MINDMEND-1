import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/PublicNavbar.jsx";
const base = import.meta.env.VITE_API_BASE_URL;

const SPECIALIZATIONS = [
  "Addiction",
  "Behavioral",
  "Child",
  "Clinical",
  "Cognitive",
  "Eating Disorder",
  "Exercise",
  "Trauma",
  "Anxiety",
  "Grief",
  "Sleep",
];

export default function Register() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    specialization: [],
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
    if (form.role === "admin") {
      alert("Admin registration is not allowed.");
      return;
    }
    try {
      const res = await axios.post(`${base}/api/auth/register`, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-700">
            MindMend Register
          </h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <select
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="therapist">Therapist</option>
            </select>

            {/* Specialization for therapists only */}
            {form.role === "therapist" && (
              <div>
                <label className="block mb-2 font-medium text-purple-700">
                  Select Specializations
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-purple-200 rounded-lg">
                  {SPECIALIZATIONS.map((spec) => (
                    <label
                      key={spec}
                      className="flex items-center space-x-2 text-sm text-purple-800"
                    >
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
              className="w-full bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
