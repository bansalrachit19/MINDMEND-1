import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createSlot, getSlots, bookAppointment, getMyAppointments, cancelAppointment, getTherapistStats
} from '../controllers/bookingController.js';

const router = express.Router();
router.patch('/mark-completed/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

    appointment.completed = true;
    await appointment.save();

    res.status(200).json({ msg: 'Appointment marked as completed' });
  } catch (err) {
    res.status(500).json({ msg: 'Error marking appointment complete' });
  }
});

router.post('/slot', protect, createSlot);
router.get('/slots', protect, getSlots);
router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.delete('/cancel/:id', protect, cancelAppointment);
router.get('/therapist-stats', protect, getTherapistStats);

export default router;
