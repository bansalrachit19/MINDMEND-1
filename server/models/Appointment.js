import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'TherapistSlot', required: true },
  note: { type: String, default: '' }, // NEW
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Appointment', appointmentSchema);
