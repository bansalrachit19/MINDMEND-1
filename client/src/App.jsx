import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import TherapistDashboard from './pages/therapist/TherapistDashboard.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import TherapistLayout from './layouts/TherapistLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import { useAuth } from './context/AuthContext';
import CreateSlot from './pages/therapist/CreateSlot.jsx';
import BookAppointment from './pages/user/BookAppointment.jsx';
import Appointments from './pages/common/Appointments.jsx';
import CalendarView from './pages/user/CalendarView.jsx';
import TherapistCalendar from './pages/therapist/CalendarView.jsx';
import MoodTracker from './pages/user/MoodTracker.jsx';
import MoodHistory from './pages/user/MoodHistory.jsx';
import { useMood } from './context/MoodContext.jsx';
import MoodAssessmentModal from './components/user/MoodAssessmentModal.jsx';
import AdminUpload from './pages/admin/AdminUpload.jsx';
import CommunityForum from './pages/forum/CommunityForum.jsx';
import ChatPage from './pages/Chat/ChatPage.jsx';
import VideoCallPage from './pages/common/VideoCallcommon.jsx';

export default function App() {
  const { user } = useAuth();
  const { showMoodModal, setShowMoodModal } = useMood();

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 User Routes */}
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
          </Route>
        )}

        {/* 🔐 Therapist Routes */}
        {user && user.role === 'therapist' && (
          <Route path="/therapist" element={<TherapistLayout user={user} />}>
            <Route index element={<TherapistDashboard />} />
            <Route path="create-slot" element={<CreateSlot />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="calendar" element={<TherapistCalendar />} />
          </Route>
        )}

        {/* 🔐 Admin Routes */}
        {user && user.role === 'admin' && (
          <Route path="/admin" element={<AdminLayout user={user} />}>
            <Route index element={<AdminUpload />} />
          </Route>
        )}

        {/* 🚫 Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/Chat" element={<ChatPage />} />
        <Route path="/video-call/:roomId" element={<VideoCallPage />} />
        <Route path="/video-call/:id" element={<VideoCallPage />} />

      </Routes>

      {/* 😶‍🌫️ Global Mood Modal */}
      {showMoodModal && (
        <MoodAssessmentModal onComplete={() => setShowMoodModal(false)} />
      )}
    </>
  );
}
