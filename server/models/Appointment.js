import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TherapistSlot',
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  chatEnabled: {
    type: Boolean,
    default: true  // You can toggle this later if needed
  },
  videoEnabled: {
    type: Boolean,
    default: true  // You can restrict this to after a session starts, etc.
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Appointment', appointmentSchema);
