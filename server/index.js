import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load env vars first

import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import './config/passport.js'; // ✅ Load strategy after env is configured
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import selfHelpRoutes from './routes/selfHelpRoutes.js'

import cron from 'node-cron';
import { sendUpcomingReminders } from './cron/sendReminders.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use(session({ secret: 'mindmend', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/mood', moodRoutes);

app.use('/api/resources', resourceRoutes);
app.use('/api/selfhelp', selfHelpRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch(err => console.error(err));

cron.schedule('0 * * * *', () => {
  console.log('⏰ Running reminder job...');
  sendUpcomingReminders();
});
