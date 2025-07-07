import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapistName: { type: String },
  date: { type: String, required: true }, // e.g. "2025-07-04"
  time: { type: String, required: true }, // e.g. "14:00"
  duration: { type: Number, default: 30 },
  isBooked: { type: Boolean, default: false }
});

export default mongoose.model('TherapistSlot', slotSchema);
