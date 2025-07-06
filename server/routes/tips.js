import express from 'express';
import { getDailyTip } from '../controllers/tipsController.js';

const router = express.Router();

router.get('/daily-tip', getDailyTip);

export default router;
