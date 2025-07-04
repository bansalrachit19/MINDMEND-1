import express from 'express';
import { logMood, getMoodHistory, getMoodStats, saveMoodAnswers  } from '../controllers/moodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/log', protect, logMood);
router.get('/history', protect, getMoodHistory);
router.get('/stats', protect, getMoodStats);
router.post('/save', protect, saveMoodAnswers);

export default router;
