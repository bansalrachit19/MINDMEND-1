import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useMood } from './context/MoodContext';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Welcome from './pages/Welcome.jsx';

import UserDashboard from './pages/user/UserDashboard.jsx';
import TherapistDashboard from './pages/therapist/TherapistDashboard.jsx';
import CreateSlot from './pages/therapist/CreateSlot.jsx';
import BookAppointment from './pages/user/BookAppointment.jsx';
import Appointments from './pages/common/Appointments.jsx';
import CalendarView from './pages/user/CalendarView.jsx';
import TherapistCalendar from './pages/therapist/CalendarView.jsx';
import MoodTracker from './pages/user/MoodTracker.jsx';
import MoodHistory from './pages/user/MoodHistory.jsx';
import BreathingExercise from './pages/user/BreathingExercise.jsx';
import CommunityForum from './pages/forum/CommunityForum.jsx';
import ChatPage from './pages/Chat/ChatPage.jsx';
import VideoCallPage from './pages/common/VideoCallcommon.jsx';

import UserLayout from './layouts/UserLayout.jsx';
import TherapistLayout from './layouts/TherapistLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminUpload from './pages/admin/AdminUpload.jsx';
import SplashLoader from './components/ui/SplashLoader.jsx';
import OAuthSuccess from './pages/OAuthSuccess.jsx';

import MoodAssessmentModal from './components/user/MoodAssessmentModal.jsx';

export default function App() {
  const { user } = useAuth();
  const { showMoodModal, setShowMoodModal } = useMood();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) return <SplashLoader />;

  return (
    <>
      <Routes>

        {/* 🌟 Welcome Landing Page */}
        <Route path="/" element={<Welcome />} />

        {/* 🛂 Public Auth Routes */}
        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}`} /> : <Register />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* 👤 User Routes */}
        {user && user.role === 'user' && (
          <Route path="/user" element={<UserLayout user={user} />}>
            <Route index element={<UserDashboard />} />
            <Route path="book" element={<BookAppointment />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="mood" element={<MoodTracker />} />
            <Route path="mood-history" element={<MoodHistory />} />
            <Route path="forum" element={<CommunityForum />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="breathing" element={<BreathingExercise />} />
          </Route>
        )}

        {/* 👨‍⚕️ Therapist Routes */}
        {user && user.role === 'therapist' && (
          <Route path="/therapist" element={<TherapistLayout user={user} />}>
            <Route index element={<TherapistDashboard />} />
            <Route path="create-slot" element={<CreateSlot />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="calendar" element={<TherapistCalendar />} />
            <Route path="forum" element={<CommunityForum />} />
          </Route>
        )}

        {/* 🛡 Admin Routes */}
        {user && user.role === 'admin' && (
          <Route path="/admin" element={<AdminLayout user={user} />}>
            <Route index element={<AdminUpload />} />
            <Route path="forum" element={<CommunityForum />} />
          </Route>
        )}

        {/* 📹 Global Chat & Video (Accessible to All Roles) */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/video-call/:roomId" element={<VideoCallPage />} />
        <Route path="/video-call/:id" element={<VideoCallPage />} />

        {/* 🔁 Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* 🧠 Global Mood Assessment Modal */}
      {showMoodModal && (
        <MoodAssessmentModal onComplete={() => setShowMoodModal(false)} />
      )}
    </>
  );
}
