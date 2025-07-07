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

// ✅ Get Available Slots (includes ones booked by current user)
export const getSlots = async (req, res) => {
  try {
    const allSlots = await TherapistSlot.find().populate('therapist', 'name specialization');

    const myAppointments = await Appointment.find({ user: req.user.id }).select('slot');
    const myBookedSlotIds = new Set(myAppointments.map(appt => appt.slot.toString()));

    const result = allSlots
      .filter(slot => !slot.isBooked || myBookedSlotIds.has(slot._id.toString()))
      .map(slot => ({
        ...slot.toObject(),
        bookedByMe: myBookedSlotIds.has(slot._id.toString())
      }));

    res.json(result);
  } catch (err) {
    console.error('❌ Failed to fetch slots:', err);
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

// ✅ Get Appointments for Current User or Therapist (Includes Review Info)
export const getMyAppointments = async (req, res) => {
  try {
    const query = req.user.role === 'user'
      ? { user: req.user.id }
      : { therapist: req.user.id };

    // Get appointments
    const appointments = await Appointment.find(query)
      .populate('slot')
      .populate('user', 'name')
      .populate('therapist', 'name')
      .lean();

    const appointmentIds = appointments.map(a => a._id);
    
    // Get reviews for those appointments
    const reviews = await Review.find({ session: { $in: appointmentIds } })
      .populate('user', 'name')
      .lean();

    // Map sessionId => review
    const reviewMap = {};
    for (const r of reviews) {
      reviewMap[r.session.toString()] = r;
    }

    // Attach review to each appointment
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

// ✅ Cancel Appointment (By User or Therapist)
export const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appt = await Appointment.findById(id).populate('slot');
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });

    const isUser = appt.user?.toString() === req.user.id;
    const isTherapist = appt.therapist?.toString() === req.user.id;
    if (!isUser && !isTherapist) return res.status(403).json({ msg: 'Not authorized to cancel this appointment' });

    const slot = await TherapistSlot.findById(appt.slot?._id);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    await Appointment.deleteOne({ _id: id });
    res.json({ msg: 'Appointment cancelled' });
  } catch (err) {
    console.error('❌ Cancellation failed:', err);
    res.status(500).json({ msg: 'Cancellation failed' });
  }
};

// ✅ Therapist Stats
export const getTherapistStats = async (req, res) => {
  try {
    const therapistId = req.user.id;

    const totalSlots = await TherapistSlot.countDocuments({ therapist: therapistId });
    const bookedSlots = await Appointment.countDocuments({ therapist: therapistId });
    const availableSlots = await TherapistSlot.countDocuments({ therapist: therapistId, isBooked: false });

    const uniqueUsers = await Appointment.aggregate([
      { $match: { therapist: new mongoose.Types.ObjectId(therapistId) } },
      { $group: { _id: '$user' } }
    ]);

    res.json({
      totalSlots,
      bookedSlots,
      availableSlots,
      uniqueUsers: uniqueUsers.length
    });
  } catch (err) {
    console.error('❌ Failed to load stats:', err);
    res.status(500).json({ msg: 'Failed to load stats' });
  }
};
