import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createSlot, getSlots, bookAppointment, getMyAppointments, cancelAppointment, getTherapistStats
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/slot', protect, createSlot);
router.get('/slots', protect, getSlots);
router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.delete('/cancel/:id', protect, cancelAppointment);
router.get('/therapist-stats', protect, getTherapistStats);

export default router;
