import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
const base = import.meta.env.VITE_API_BASE_URL;

export default function CalendarView() {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchSlots = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${base}/api/bookings/slots`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSlots(res.data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Group slots by date for display
  const slotsByDate = slots.reduce((acc, slot) => {
    acc[slot.date] = acc[slot.date] || [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const formattedDate = selectedDate.toLocaleDateString('en-CA'); 

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">📅 Browse Therapist Slots</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white shadow-xl p-4">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date }) => {
              const d = date.toLocaleDateString('en-CA');
              return slotsByDate[d] ? 'bg-purple-100 rounded-full' : '';
            }}
          />
        </div>

        <div className="bg-purple-50 p-4 rounded-xl shadow-xl">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">Slots on {formattedDate}</h3>
          {slotsByDate[formattedDate] ? (
            slotsByDate[formattedDate].map((slot) => (
              <div key={slot._id} className="border-b border-purple-200 py-2">
                <p className="font-medium">{slot.time} ({slot.duration} mins)</p>
                <p className="text-sm text-gray-600">By: {slot.therapist.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No slots on this day</p>
          )}
        </div>
      </div>
    </div>
  );
}
