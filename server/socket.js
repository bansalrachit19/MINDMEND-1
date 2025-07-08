// socket.js

import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ New socket connected:', socket.id);

    socket.on('join-room', (data) => {
      if (!data || !data.roomId) {
        console.error('❌ Invalid join-room payload:', data);
        return;
      }
      const { roomId } = data;
      socket.join(roomId);
    });

    socket.on('send-message', ({ roomId, message, senderId, _id  }) => {
      if (!roomId || !message || !senderId){
        console.log('room id not available');
        return;
      }
      io.to(roomId).emit('receive-message', {message, senderId, _id });
    });

    socket.on('typing', ({ roomId, user }) => {
        if (!roomId || !user) return;
      socket.to(roomId).emit('user-typing', user);
    });

    socket.on('stop-typing', ({ roomId, user }) => {
        if (!roomId || !user) return;
      socket.to(roomId).emit('user-stopped-typing', user);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};
