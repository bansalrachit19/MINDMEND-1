import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../../components/common/ReviewModal.jsx";
const base = import.meta.env.VITE_API_BASE_URL;

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${base}/api/bookings/my-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      alert("Error loading appointments");
    }
  };

  const cancelAppointment = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${base}/api/bookings/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cancelled");
      fetchAppointments();
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  const isSessionActive = (dateStr, timeStr) => {
    const start = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    return now >= new Date(start.getTime() - 5 * 60 * 1000) &&
           now <= new Date(start.getTime() + 45 * 60 * 1000);
  };

  const isPast = (dateStr, timeStr) => new Date() > new Date(`${dateStr}T${timeStr}`);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        {user.role === "user"
          ? "My Therapy Sessions"
          : "Your Scheduled Appointments"}
      </h2>

      <div className="space-y-4">
        {appointments.map((appt) => {
          const { date, time } = appt.slot;
          const sessionActive = isSessionActive(date, time);
          const sessionPassed = isPast(date, time);

          return (
            <div
              key={appt._id}
              className="bg-white border border-purple-200 p-4 rounded-xl shadow"
            >
              <div className="space-y-1 mb-4">
                <p>
                  <strong>Date:</strong> {date} at {time}
                </p>
                <p>
                  <strong>
                    {user.role === "user" ? "Therapist" : "Client"}:
                  </strong>{" "}
                  {user.role === "user" ? appt.therapist.name : appt.user.name}
                </p>
                {appt.note && (
                  <p>
                    <strong>Note:</strong> {appt.note}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-between">
                {/* ❌ Cancel Button */}
                {!appt.completed && (
                  <button
                    onClick={() => cancelAppointment(appt._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Cancel Appointment
                  </button>
                )}

                {/* 💬 Message */}
                <button
                  onClick={() =>
                    navigate(
                      `/chat?therapist=${
                        user.role === "user"
                          ? appt.therapist._id
                          : appt.user._id
                      }`
                    )
                  }
                  className="text-sm bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700"
                >
                  💬 Message{" "}
                  {user.role === "user" ? "Your Therapist" : "Client"}
                </button>

                {/* 🎥 Video Call */}
                {appt.completed ? (
                  <span className="text-sm text-green-600">
                    ✅ Session Completed
                  </span>
                ) : sessionActive ? (
                  <button
                    onClick={() => navigate(`/video-call/${appt._id}`)}
                    className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
                  >
                    🎥{" "}
                    {user.role === "user"
                      ? "Start Video Call"
                      : "Join Video Call"}
                  </button>
                ) : sessionPassed ? (
                  <span className="text-sm text-gray-500">⏰ Time Passed</span>
                ) : (
                  <span className="text-sm text-gray-500">🕒 Not yet time</span>
                )}

                {/* ⭐ Review Button (only for users, after sessionActive or completed, if not reviewed) */}
                {user.role === "user" && !appt.reviewed && (sessionActive || appt.completed) && (
                  <button
                    onClick={() =>
                      setSelectedAppointment({
                        id: appt._id,
                        therapistId: appt.therapist._id,
                      })
                    }
                    className="text-sm bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700"
                  >
                    ⭐ Leave a Review
                  </button>
                )}

                {/* ✅ User Sees Their Submitted Review */}
                {user.role === "user" && appt.reviewed && appt.review && (
                  <div className="text-sm text-gray-800">
                    <p><strong>⭐ Your Rating:</strong> {appt.review.rating}/5</p>
                       {appt.review.text ? (
      <p><strong>📝 Your Review:</strong> {appt.review.text}</p>
    ) : (
      <p className="text-gray-400 italic">No review text provided.</p>
    )}
                  </div>
                )}

                {/* 👨‍⚕️ Therapist Sees Client Review */}
                {user.role === "therapist" && appt.review && (
                  <div className="text-sm text-gray-800">
                    <p><strong>⭐ Rating:</strong> {appt.review.rating}/5</p>
                       {appt.review.text ? (
      <p><strong>📝 Your Review:</strong> {appt.review.text}</p>
    ) : (
      <p className="text-gray-400 italic">No review text provided.</p>
    )}
                    <p><strong>👤 By:</strong> {appt.review.user?.name || "Client"}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ⭐ Review Modal */}
      {selectedAppointment && (
        <ReviewModal
          isOpen={!!selectedAppointment}
          appointmentId={selectedAppointment.id}
          therapistId={selectedAppointment.therapistId}
          onClose={() => setSelectedAppointment(null)}
          onReviewSubmit={fetchAppointments}
        />
      )}
    </div>
  );
}
