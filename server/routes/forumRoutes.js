import express from 'express';
import {
  createPost, getPostsByTopic, commentOnPost, reportPost, replyComment, reactToPost
} from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createPost);
router.get('/topic/:topic', protect, getPostsByTopic);
router.post('/:postId/comment', protect, commentOnPost);
router.post('/:postId/comment/:commentId/reply', protect, replyComment);
router.put('/report/:postId', protect, reportPost);
router.post('/:postId/react', protect, reactToPost);


export default router;
