import express from 'express';
import { leaveReview, getTherapistReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// reviewRoutes.js
router.post('/:appointmentId', protect, leaveReview);

router.get('/:id', protect, getTherapistReviews); // therapist ID

export default router;
