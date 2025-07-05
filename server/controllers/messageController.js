import Message from '../models/messageModel.js';

export const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;

  try {
    const message = await Message.create({ sender: senderId, receiver: receiverId, content });
    res.json(message);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to send message' });
  }
};
export const getChatPartners = async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  if (userRole === 'therapist') {
    const appointments = await Appointment.find({ therapist: userId }).populate('user', 'name email');
    const users = [...new Map(appointments.map(appt => [appt.user._id.toString(), appt.user])).values()];
    return res.json(users);
  }

  if (userRole === 'user') {
    const appointments = await Appointment.find({ user: userId }).populate('therapist', 'name email');
    const therapists = [...new Map(appointments.map(appt => [appt.therapist._id.toString(), appt.therapist])).values()];
    return res.json(therapists);
  }

  res.status(403).json({ msg: 'Unauthorized' });
};


export const getMessages = async (req, res) => {
  const userId = req.user.id;
  const partnerId = req.query.partnerId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch messages' });
  }
};
