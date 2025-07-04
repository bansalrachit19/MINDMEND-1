import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const { user } = useAuth();

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

  const cancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      const token = localStorage.getItem("token");
      console.log(id);
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
        {user.role === "user"
          ? "My Therapy Sessions"
          : "Your Scheduled Appointments"}
      </h2>
      <div className="space-y-4">
        {appointments.map((a) => (
          <div
            key={a._id}
            className="bg-white border border-purple-200 p-4 rounded-xl shadow flex flex-col justify-between"
          >
            <div className="space-y-1">
              <p>
                <strong>Date:</strong> {a.slot.date} at {a.slot.time}
              </p>
              {user.role === "user" ? (
                <p>
                  <strong>Therapist:</strong> {a.therapist.name}
                </p>
              ) : (
                <p>
                  <strong>Client:</strong> {a.user.name}
                </p>
              )}
              {a.note && (
                <p>
                  <strong>Note:</strong> {a.note}
                </p>
              )}
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => cancel(a._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
