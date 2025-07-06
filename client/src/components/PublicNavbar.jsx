import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, SmilePlus } from 'lucide-react';

export default function PublicNavbar() {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/user', '/therapist', '/admin'];
  const shouldHide = hideNavbarOnRoutes.some(path => location.pathname.startsWith(path));

  if (shouldHide) return null;

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-purple-700 font-bold text-xl">
          <SmilePlus className="w-6 h-6 text-purple-600" />
          MindMend
        </Link>

        {/* Links */}
        <div className="flex gap-6 items-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-purple-700 transition text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-purple-700 transition text-sm font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition"
          >
            Join Now
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
