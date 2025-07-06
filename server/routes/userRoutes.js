import express from 'express';
import {matchTherapists, getUserById} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/match-therapists', protect, matchTherapists);
router.get('/:id', protect, getUserById);

export default router;