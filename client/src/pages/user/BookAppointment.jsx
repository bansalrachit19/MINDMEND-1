import { useState, useEffect } from "react";
import axios from "axios";
const base = import.meta.env.VITE_API_BASE_URL;
import { Loader2 } from "lucide-react";

export default function BookAppointment() {
  const [slots, setSlots] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${base}/api/bookings/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
      console.log(slots);
    } catch (err) {
      console.error("❌ Failed to fetch slots", err);
    } finally{
      setLoading(false);
    }
  };

  const book = async (slotId, therapistId) => {
    const token = localStorage.getItem("token");
    const note = notes[slotId] || "";
    try {
      await axios.post(
        `${base}/api/bookings/book`,
        { slotId, note },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("🎉 Appointment booked!");
      fetchSlots(); // Refresh the slot list
    } catch (err) {
      alert(err.response?.data?.msg || "Booking failed");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-emerald-50 to-purple-100">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        Available Therapist Slots
      </h2>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          <p className="text-xl font-medium">
            No slots available right now.
          </p>
          <p className="mt-2 text-sm">
            Please check back later or try another therapist.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="bg-white shadow rounded-xl p-4 border border-purple-100"
            >
              <p className="font-medium text-purple-600">
                {slot.therapist?.name ||
                  slot.therapistName ||
                  "Unknown Therapist"}
              </p>
              {slot.therapist?.specialization?.length > 0 && (
                <p className="text-sm text-gray-500">
                  Specializations: {slot.therapist.specialization.join(", ")}
                </p>
              )}
              {slot.therapist?.avgRating && (
                <p className="text-yellow-500 text-sm font-semibold">
                  ⭐ {slot.therapist.avgRating} / 5
                </p>
              )}

              <p className="text-gray-500">
                {slot.date} at {slot.time}
              </p>
              <p className="text-sm text-gray-600 italic">
                Duration: {slot.duration} mins
              </p>

              <textarea
                placeholder="Your message for therapist..."
                className="mt-2 p-2 w-full border rounded-lg text-sm"
                value={notes[slot._id] || ""}
                onChange={(e) =>
                  setNotes({ ...notes, [slot._id]: e.target.value })
                }
              />

              <button
                onClick={() => book(slot._id, slot.therapist._id)}
                className="mt-2 w-full bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
