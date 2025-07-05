import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendMessage, getMessages, getChatPartners } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/', protect, getMessages);
router.get('/partners', protect, getChatPartners);


export default router;
