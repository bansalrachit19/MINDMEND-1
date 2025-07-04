import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'angry', 'neutral', 'excited'],
    required: true
  },
  note: { type: String },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('MoodEntry', moodEntrySchema);
