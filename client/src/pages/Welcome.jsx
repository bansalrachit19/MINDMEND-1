import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import wellnessAnimation from "../assets/wellness.json";
import DailyTip from "../components/DailyTip.jsx";
import { Sparkles, Heart, Brain, Users, Star, Smile } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar.jsx";

export default function Welcome() {
  return (
    <>
      <PublicNavbar/>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-white relative overflow-hidden">
        {/* Sparkle Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-300/30 via-white/10 to-transparent"></div>
        </motion.div>

        {/* Main Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 pt-24">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-purple-800 mb-4"
          >
            Welcome to{" "}
            <span className="bg-purple-300 px-2 rounded-xl text-white">
              MindMend
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-gray-700 max-w-2xl"
          >
            Your journey to a healthier mind starts here. Track your mood,
            connect with therapists, explore personalized self-help tools - all
            in one safe space.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-73 h-73 mt-8"
          >
            <Lottie animationData={wellnessAnimation} loop autoplay />
          </motion.div>

          {/* ✨ Innovative Interactive Tip Area */}
          {/* <motion.div
          className="mt-2 text-purple-800 bg-purple-100 px-6 py-4 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Smile className="inline w-5 h-5 mr-2" />
          <span className="font-medium">Tip of the Day:</span> Did you know writing down 3 things you're grateful for improves mental clarity? 🧠💜
        </motion.div> */}

          <DailyTip />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex gap-6 mt-8 flex-wrap justify-center"
          >
            <Link
              to="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-6 py-3 rounded-xl shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/register"
              className="bg-white border-2 border-purple-500 text-purple-700 text-lg px-6 py-3 rounded-xl shadow-md hover:bg-purple-100"
            >
              Join MindMend
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 flex items-center text-purple-700 gap-2"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-md">
              Trusted by thousands on their wellness journey
            </span>
          </motion.div>
        </div>

        {/* New Features Section */}
        <motion.div
          className="relative z-10 px-8 py-20 bg-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center text-purple-800 mb-12">
            Why Choose MindMend?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <Heart className="text-purple-600 w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold text-purple-700">
                Mood Tracking
              </h3>
              <p className="text-gray-600 text-sm">
                Log daily moods and thoughts to understand yourself better over
                time.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Brain className="text-purple-600 w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold text-purple-700">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600 text-sm">
                Get smart recommendations based on your mood patterns.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="text-purple-600 w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold text-purple-700">
                Therapist Matching
              </h3>
              <p className="text-gray-600 text-sm">
                Find the right therapist for your needs using intelligent
                matching.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Star className="text-purple-600 w-10 h-10 mb-3" />
              <h3 className="text-lg font-semibold text-purple-700">
                Self-Help Library
              </h3>
              <p className="text-gray-600 text-sm">
                Explore curated articles, videos, meditations, and exercises
                anytime.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final Call to Action */}
        <motion.div
          className="relative z-10 bg-purple-600 text-white text-center py-16 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Take the First Step Toward Better Mental Wellness
          </h2>
          <p className="text-lg mb-8">
            Join MindMend today and start your healing journey with the support
            you deserve.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-purple-100"
          >
            Join Now
          </Link>
        </motion.div>

        {/* 🌟 Beautiful Footer */}
        <footer className="bg-purple-800 text-white text-center py-6 text-sm">
          <div className="max-w-4xl mx-auto px-4">
            © {new Date().getFullYear()} MindMend. Empowering mental wellness
            with compassion and technology.
          </div>
        </footer>
      </div>
    </>
  );
}
