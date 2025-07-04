import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import TherapistSlot from '../models/TherapistSlot.js';
import { sendReminderEmail } from '../utils/emailSender.js';
import dayjs from 'dayjs';

export const sendUpcomingReminders = async () => {
  const now = dayjs();
  const targetTime = now.add(12, 'hour');

  const appointments = await Appointment.find({})
    .populate('user therapist slot');

  const upcoming = appointments.filter(a => {
    const slotDate = dayjs(`${a.slot.date} ${a.slot.time}`);
    return slotDate.isAfter(now) && slotDate.isBefore(targetTime);
  });

  for (let a of upcoming) {
    const slotTime = `${a.slot.date} at ${a.slot.time}`;
    
    const userHtml = `
      <h2 style="color: #7e5bef">Hi ${a.user.name},</h2>
      <p>This is a friendly reminder about your appointment with therapist <strong>${a.therapist.name}</strong> on <strong>${slotTime}</strong>.</p>
      <br />
      <p>Stay well,</p>
      <p>💜 MindMend</p>
    `;

    const therapistHtml = `
      <h2 style="color: #7e5bef">Hi ${a.therapist.name},</h2>
      <p>You have an upcoming session with <strong>${a.user.name}</strong> scheduled for <strong>${slotTime}</strong>.</p>
      <br />
      <p>Thanks for supporting our community,</p>
      <p>💜 MindMend</p>
    `;

    await sendReminderEmail(a.user.email, '⏰ Therapy Reminder – MindMend', userHtml);
    await sendReminderEmail(a.therapist.email, '⏰ Upcoming Session Reminder – MindMend', therapistHtml);
  }
};
