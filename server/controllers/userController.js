import mongoose from 'mongoose';
import User from '../models/User.js';

export const matchTherapists = async (req, res) => {
  try {
    const { keywords } = req.body;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ msg: 'Keywords must be a non-empty array' });
    }

    // Normalize keywords to match DB casing
    const normalized = keywords.map(k => k.trim().toLowerCase());

    const therapists = await User.find({
      role: 'therapist',
      specialization: {
        $in: normalized.map(k =>
          k.charAt(0).toUpperCase() + k.slice(1) // e.g. 'anxiety' → 'Anxiety'
        )
      }
    }).select('-password -googleId -__v'); // Exclude sensitive info

    res.json(therapists);
  } catch (err) {
    console.error('Therapist matching error:', err);
    res.status(500).json({ msg: 'Server error while matching therapists' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(' Error fetching user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
