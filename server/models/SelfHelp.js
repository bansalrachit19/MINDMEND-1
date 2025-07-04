// models/SelfHelp.js
import mongoose from 'mongoose';

const selfHelpSchema = new mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ['video', 'article', 'guide', 'meditation', 'exercise'],
    default: 'article'
  },
  link: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SelfHelp', selfHelpSchema);
