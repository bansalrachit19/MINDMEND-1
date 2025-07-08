import express from 'express';
import passport from 'passport';
import { login, register, authUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, authUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  session: false
}), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 3 * 24 * 60 * 60 * 1000
  });
  res.redirect('https://mindmend-1.vercel.app/oauth-success');
});

export default router;
