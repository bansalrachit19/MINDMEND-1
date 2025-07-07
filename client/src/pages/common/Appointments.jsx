import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../../components/common/ReviewModal.jsx"; // ✅ Make sure this file exists

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/bookings/my-appointments", {
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
      await axios.delete(`/api/bookings/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cancelled");
      fetchAppointments();
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        {user.role === "user" ? "My Therapy Sessions" : "Your Scheduled Appointments"}
      </h2>

      <div className="space-y-4">
        {appointments.map((a) => (
          <div
            key={a._id}
            className="bg-white border border-purple-200 p-4 rounded-xl shadow"
          >
            <div className="space-y-1 mb-4">
              <p><strong>Date:</strong> {a.slot.date} at {a.slot.time}</p>
              {user.role === "user" ? (
                <p><strong>Therapist:</strong> {a.therapist.name}</p>
              ) : (
                <p><strong>Client:</strong> {a.user.name}</p>
              )}
              {a.note && <p><strong>Note:</strong> {a.note}</p>}
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-between">
              {/* Cancel Button */}
              <button
                onClick={() => cancelAppointment(a._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Cancel Appointment
              </button>

              {/* Message Button */}
              {user.role === "user" ? (
                <button
                  onClick={() => navigate(`/chat?therapist=${a.therapist._id}`)}
                  className="text-sm bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700"
                >
                  💬 Message Your Therapist
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/chat?therapist=${a.user._id}`)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  💬 Message Client
                </button>
              )}

              {/* Video Call Button */}
              <button
                onClick={() => navigate(`/video-call/${a._id}`)}
                className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
              >
                🎥 {user.role === "user" ? "Start Video Call" : "Join Video Call"}
              </button>

              {/* ⭐ Review Button */}
              {user.role === "user" && (
                <button
                  onClick={() =>
                    setSelectedAppointment({
                      id: a._id,
                      therapistId: a.therapist._id,
                    })
                  }
                  className="text-sm bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700"
                >
                  ⭐ Leave a Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
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
