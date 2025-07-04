import MoodEntry from '../models/MoodEntry.js';
import dayjs from 'dayjs';
import User from '../models/User.js';

export const logMood = async (req, res) => {
  try {
    const { mood, note } = req.body;
    const userId = req.user.id;

    // Prevent duplicate mood logs per day
    const today = dayjs().startOf('day').toDate();
    const existing = await MoodEntry.findOne({ user: userId, date: { $gte: today } });
    if (existing) return res.status(400).json({ msg: 'Mood already logged today' });

    const entry = await MoodEntry.create({ user: userId, mood, note });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to log mood' });
  }
};

export const getMoodHistory = async (req, res) => {
  try {
    const entries = await MoodEntry.find({ user: req.user.id }).sort({ date: -1 }).limit(30);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch mood history' });
  }
};

export const getMoodStats = async (req, res) => {
  try {
    const entries = await MoodEntry.find({ user: req.user.id });
    const moodMap = entries.reduce((acc, e) => {
      acc[e.mood] = (acc[e.mood] || 0) + 1;
      return acc;
    }, {});
    res.json(moodMap);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch mood stats' });
  }
};

export const saveMoodAnswers = async (req, res) => {
  const userId = req.user.id;
  const { answers, score, category } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, {
      hasFilledMood: true,
      lastMoodCheck: new Date()
    });
    res.json({ msg: 'Mood saved', category });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to save mood' });
  }
};
