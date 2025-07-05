import express from 'express';
import { createResource, getAllResources, deleteResource, suggestResourcesByAI, approveSelfHelpResource, getResourcesForUserMood } from '../controllers/selfHelpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', protect, createResource);
router.get('/all', getAllResources);
router.delete('/:id', protect, deleteResource);
router.post('/ai-suggest', protect, suggestResourcesByAI);
router.put('/approve/:id', protect, approveSelfHelpResource);
router.get('/user-matches', protect, getResourcesForUserMood);

export default router;
