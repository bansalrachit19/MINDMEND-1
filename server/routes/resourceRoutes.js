import express from 'express';
import { getResources, createResource } from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getResources);
router.post('/', protect, createResource);

export default router;
