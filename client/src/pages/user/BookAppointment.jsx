import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookAppointment() {
  const [slots, setSlots] = useState([]);
  const [notes, setNotes] = useState({}); // track note per slot

  const fetchSlots = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/bookings/slots', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSlots(res.data);
  };

  const book = async (slotId) => {
    const token = localStorage.getItem('token');
    const note = notes[slotId] || '';
    try {
      await axios.post('/api/bookings/book', { slotId, note }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Appointment booked!');
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.msg || 'Booking failed');
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Available Therapist Slots</h2>
      <div className="grid md:grid-cols-2 gap-4 transition-all hover:scale-[1.02] duration-200">
        {slots.map(slot => (
          <div key={slot._id} className="bg-white shadow rounded-xl p-4 border border-purple-100">
            <p className="font-medium text-purple-600">{slot.therapist.name}</p>
            <p className="text-gray-500">{slot.date} at {slot.time}</p>
            <p className="text-sm text-gray-600 italic">Duration: {slot.duration} mins</p>

            <textarea
              placeholder="Your message for therapist..."
              className="mt-2 p-2 w-full border rounded-lg text-sm"
              value={notes[slot._id] || ''}
              onChange={e => setNotes({ ...notes, [slot._id]: e.target.value })}
            />

            <button
              onClick={() => book(slot._id)}
              className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
