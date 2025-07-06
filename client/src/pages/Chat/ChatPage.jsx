import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', { withCredentials: true });

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const searchParams = new URLSearchParams(useLocation().search);
  const receiverId = searchParams.get('therapist');

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/messages?partnerId=${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error loading messages', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiverDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/users/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReceiverName(res.data.name);
    } catch (err) {
      console.error('Error fetching user', err);
    }
  };

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/messages',
        { receiverId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.emit('send-message', { roomId: receiverId, message: content });
      setContent('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchReceiverDetails();

    socket.emit('join-room', { roomId: receiverId });

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, { content: message, sender: receiverId }]);
    });

    return () => {
      socket.off('receive-message');
      socket.disconnect();
    };
  }, [receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-emerald-100 p-6">
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">
        Chat with {receiverName || 'Therapist'}
      </h2>

      <div className="flex-1 bg-white rounded-xl shadow-md p-4 overflow-y-auto mb-4 max-h-[60vh]">
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.sender === receiverId ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === receiverId
                    ? 'bg-gray-200 text-black'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
