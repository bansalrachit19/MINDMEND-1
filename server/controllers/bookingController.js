import mongoose from 'mongoose';
import TherapistSlot from '../models/TherapistSlot.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

// ✅ Create Slot (Therapist Only)
export const createSlot = async (req, res) => {
  if (req.user.role !== 'therapist') return res.status(403).json({ msg: 'Unauthorized' });

  const { date, time, duration } = req.body;

  try {
    const exists = await TherapistSlot.findOne({ therapist: req.user.id, date, time });
    if (exists) return res.status(400).json({ msg: 'Slot already exists' });

    const therapist = await User.findById(req.user.id);
    const slot = await TherapistSlot.create({
      therapist: req.user.id,
      therapistName: therapist.name,
      date,
      time,
      duration: duration || 30,
    });

    res.json(slot);
  } catch (err) {
    console.error('❌ Error creating slot:', err);
    res.status(500).json({ msg: 'Error creating slot' });
  }
};

// ✅ Get Available Slots (only truly unbooked)
export const getSlots = async (req, res) => {
  try {
    const availableSlots = await TherapistSlot.find({ isBooked: false })
      .populate('therapist', 'name specialization') // just name & specialization

    // Get all therapist IDs from slots
    const therapistIds = [...new Set(availableSlots.map(slot => slot.therapist?._id.toString()))];

    // Fetch all reviews for these therapists
    const reviews = await Review.find({ therapist: { $in: therapistIds } });

    // Group ratings per therapist
    const ratingMap = {};
    reviews.forEach(r => {
      const tId = r.therapist.toString();
      if (!ratingMap[tId]) ratingMap[tId] = [];
      ratingMap[tId].push(r.rating);
    });

    // Compute avg rating per therapist
    const avgRatingMap = {};
    Object.entries(ratingMap).forEach(([tId, ratings]) => {
      const sum = ratings.reduce((a, b) => a + b, 0);
      avgRatingMap[tId] = (sum / ratings.length).toFixed(1);
    });

    // Attach avgRating to each slot's therapist
    const enrichedSlots = availableSlots.map(slot => {
      const therapistId = slot.therapist?._id?.toString();
      return {
        ...slot.toObject(),
        therapist: {
          ...slot.therapist?.toObject(),
          avgRating: avgRatingMap[therapistId] || null
        }
      };
    });

    res.json(enrichedSlots);
  } catch (err) {
    console.error('❌ Failed to fetch slots with ratings:', err);
    res.status(500).json({ msg: 'Failed to fetch slots' });
  }
};


// ✅ Book Appointment (User Only)
export const bookAppointment = async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ msg: 'Unauthorized' });

  const { slotId, note } = req.body;

  try {
    const slot = await TherapistSlot.findById(slotId);
    if (!slot || slot.isBooked) return res.status(400).json({ msg: 'Slot unavailable' });

    const appointment = await Appointment.create({
      user: req.user.id,
      therapist: slot.therapist,
      slot: slot._id,
      note,
    });

    slot.isBooked = true;
    await slot.save();

    res.json(appointment);
  } catch (err) {
    console.error('❌ Booking failed:', err);
    res.status(500).json({ msg: 'Booking failed' });
  }
};

// ✅ Get Appointments (with Review Info)
export const getMyAppointments = async (req, res) => {
  try {
    const query = req.user.role === 'user'
      ? { user: req.user.id }
      : { therapist: req.user.id };

    const appointments = await Appointment.find(query)
      .populate('slot')
      .populate('user', 'name')
      .populate('therapist', 'name')
      .lean();

    const appointmentIds = appointments.map(a => a._id);

    const reviews = await Review.find({ session: { $in: appointmentIds } })
      .populate('user', 'name')
      .lean();

    const reviewMap = {};
    for (const r of reviews) {
      reviewMap[r.session.toString()] = r;
    }

    const enrichedAppointments = appointments.map(appt => ({
      ...appt,
      review: reviewMap[appt._id.toString()] || null,
    }));

    res.json(enrichedAppointments);
  } catch (err) {
    console.error('❌ Failed to fetch appointments:', err);
    res.status(500).json({ msg: 'Could not fetch appointments' });
  }
};

// ✅ Cancel Appointment (slot stays marked as booked)
export const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });

    const isUser = appt.user?.toString() === req.user.id;
    const isTherapist = appt.therapist?.toString() === req.user.id;
    if (!isUser && !isTherapist) return res.status(403).json({ msg: 'Not authorized to cancel this appointment' });

    // DO NOT make slot available again
    await Appointment.deleteOne({ _id: id });

    res.json({ msg: 'Appointment cancelled' });
  } catch (err) {
    console.error('❌ Cancellation failed:', err);
    res.status(500).json({ msg: 'Cancellation failed' });
  }
};

// ✅ Therapist Stats (including average rating)
export const getTherapistStats = async (req, res) => {
  try {
    const therapistId = req.user.id;

    // Fetch completed appointments to exclude from totalSlots
    const completedAppointments = await Appointment.find({
      therapist: therapistId,
      completed: true,
    }).select('slot');

    const completedSlotIds = new Set(completedAppointments.map(a => a.slot.toString()));
    const allSlots = await TherapistSlot.find({ therapist: therapistId });
    const totalSlots = allSlots.filter(slot => !completedSlotIds.has(slot._id.toString())).length;
    const bookedSlots = await Appointment.countDocuments({ therapist: therapistId });
    const availableSlots = allSlots.filter(slot => !slot.isBooked).length;

    const uniqueUsers = await Appointment.aggregate([
      { $match: { therapist: new mongoose.Types.ObjectId(therapistId) } },
      { $group: { _id: '$user' } }
    ]);

    // ⬇️ Get Reviews for this therapist’s sessions
    const reviews = await Review.find({ therapist: therapistId });

    let avgRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      avgRating = (sum / reviews.length).toFixed(1);
    }

    res.json({
      totalSlots,
      bookedSlots,
      availableSlots,
      uniqueUsers: uniqueUsers.length,
      avgRating,
      totalReviews: reviews.length
    });
  } catch (err) {
    console.error('❌ Failed to load stats:', err);
    res.status(500).json({ msg: 'Failed to load stats' });
  }
};
