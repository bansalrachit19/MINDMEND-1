import express from 'express';
import { createResource, getAllResources, deleteResource } from '../controllers/selfHelpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', protect, createResource);
router.get('/all', getAllResources);
router.delete('/:id', protect, deleteResource);

export default router;
