import TherapistSlot from '../models/TherapistSlot.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export const createSlot = async (req, res) => {
  if (req.user.role !== 'therapist') return res.status(403).json({ msg: 'Unauthorized' });

  const { date, time, duration } = req.body;
  try {
    const exists = await TherapistSlot.findOne({ therapist: req.user.id, date, time });
    if (exists) return res.status(400).json({ msg: 'Slot already exists' });

    const slot = await TherapistSlot.create({ therapist: req.user.id, date, time, duration: duration || 30 });
    res.json(slot);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating slot' });
  }
};

export const getSlots = async (req, res) => {
  try {
    const slots = await TherapistSlot.find({ isBooked: false }).populate('therapist', 'name');
    res.json(slots);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch slots' });
  }
};

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
      note // ✅ Save user note
    });

    slot.isBooked = true;
    await slot.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ msg: 'Booking failed' });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const query = req.user.role === 'user'
      ? { user: req.user.id }
      : { therapist: req.user.id };

    const appointments = await Appointment.find(query)
      .populate('slot')
      .populate('user', 'name')
      .populate('therapist', 'name');

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Could not fetch appointments' });
  }
};

export const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  console.log('Cancel Request for:', id);

  try {
    const appt = await Appointment.findById(id).populate('slot');

    if (!appt){
        console.log('appointment not found');
        return res.status(404).json({ msg: 'Appointment not found' });
    }

    console.log('Appointment:', appt);

    const isUser = appt.user?.toString() === req.user.id;
    const isTherapist = appt.therapist?.toString() === req.user.id;

    if (!isUser && !isTherapist) {
      console.log('Unauthorized attempt');
      return res.status(403).json({ msg: 'Not authorized to cancel this appointment' });
    }

    console.log('making slot avaiblble again');

    // Mark slot as available again
    const slot = await TherapistSlot.findById(appt.slot?._id);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    await Appointment.deleteOne({ _id: id });
    console.log('Appointment successfully cancelled');

    res.json({ msg: 'Appointment cancelled' });
  } catch (err) {
    console.error('Error during cancellation:', err);
    res.status(500).json({ msg: 'Cancellation failed' });
  }
};

export const getTherapistStats = async (req, res) => {
  try {
    const therapistId = req.user.id;

    const totalSlots = await TherapistSlot.countDocuments({ therapist: therapistId });
    const bookedSlots = await Appointment.countDocuments({ therapist: therapistId });
    const availableSlots = await TherapistSlot.countDocuments({ therapist: therapistId, isBooked: false });
    const uniqueUsers = await Appointment.aggregate([
      { $match: { therapist: therapistId } },
      { $group: { _id: '$user' } }
    ]);

    res.json({
      totalSlots,
      bookedSlots,
      availableSlots,
      uniqueUsers: uniqueUsers.length
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load stats' });
  }
};

