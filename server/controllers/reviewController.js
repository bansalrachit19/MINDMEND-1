import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';

export const leaveReview = async (req, res) => {
  try {
    const { therapistId, rating, text } = req.body;
    const sessionId = req.params.appointmentId;
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

    await Appointment.findByIdAndUpdate(sessionId, { reviewed: true });

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


export const getReviewForSession = async (req, res) => {
  try {
    const review = await Review.findOne({ session: req.params.sessionId }).populate("user", "name");
    if (!review) return res.status(404).json({ msg: "No review yet" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch review" });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.reviewed) return res.status(400).json({ message: "Already reviewed" });

    appointment.review = { rating, comment };
    appointment.reviewed = true;
    await appointment.save();

    res.status(200).json({ message: "Review submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

