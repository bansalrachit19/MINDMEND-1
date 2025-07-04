import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['Video', 'Article', 'Exercise'],
    required: true
  },
  url: { type: String, required: true },
  thumbnail: String,
}, { timestamps: true });

export default mongoose.model('Resource', ResourceSchema);
