import express from 'express';
import {
  leaveReview,
  getTherapistReviews,
  getReviewForSession,  // ✅ add this
} from "../controllers/reviewController.js";

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// reviewRoutes.js
router.post('/:appointmentId', protect, leaveReview);
router.get('/session/:sessionId', protect, getReviewForSession);
router.get('/:id', protect, getTherapistReviews); // therapist ID

export default router;
