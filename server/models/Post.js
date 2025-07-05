import mongoose from 'mongoose';

// Reply schema
const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Comment schema (with replies inside)
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema]
});

const reactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emoji: { type: String, enum: ['❤️', '😂', '😢', '😡'], required: true }
});

// Main post schema
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  topic: { type: String, required: true },
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema],
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reactions: [reactionSchema]
});

export default mongoose.model('Post', postSchema);
