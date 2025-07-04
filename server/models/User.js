import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'therapist', 'admin'], default: 'user', required: true },
  googleId: { type: String },
  specialization: {
    type: [String],
    enum: [
      'Addiction',
      'Behavioral',
      'Child',
      'Clinical',
      'Cognitive',
      'Eating Disorder',
      'Exercise',
      'Trauma',
      'Anxiety',
      'Grief',
      'Sleep'
    ],
    default: []
  },
  hasFilledMood: {
    type: Boolean,
    default: false
  },
  lastMoodCheck: Date
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
