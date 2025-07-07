import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';

export const leaveReview = async (req, res) => {
  try {
    const { therapistId, rating, text } = req.body;
    const sessionId = req.params.appointmentId; // ✅ Get session/appointment from URL
    const userId = req.user.id;

    const alreadyReviewed = await Review.findOne({ user: userId, session: sessionId });
    if (alreadyReviewed) {
      return res.status(400).json({ msg: 'You already reviewed this session' });
    }

    const review = await Review.create({
      user: userId,
      therapist: therapistId,
      session: sessionId,
      rating,
      text,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("❌ Failed to leave review:", err);
    res.status(500).json({ msg: 'Failed to leave review' });
  }
};

export const getTherapistReviews = async (req, res) => {
  try {
    const therapistId = req.params.id;
    const reviews = await Review.find({ therapist: therapistId }).populate('user', 'name');

    const avgRating = reviews.length
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.json({ avgRating, reviews });
  } catch (err) {
    console.error('❌ Failed to fetch reviews:', err);
    res.status(500).json({ msg: 'Failed to fetch reviews' });
  }
};
