import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const emojis = ['❤️', '😂', '😢', '😡'];

export default function CommunityForum() {
  const [topic, setTopic] = useState('general');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [topic]);

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/api/forum/topic/${topic}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPosts(res.data);
  };

  const handleSubmitPost = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/forum/create', {
      content: newPost, topic, anonymous
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNewPost('');
    fetchPosts();
  };

  const handleComment = async (postId) => {
    const token = localStorage.getItem('token');
    await axios.post(`/api/forum/${postId}/comment`, {
      content: commentInputs[postId]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCommentInputs({ ...commentInputs, [postId]: '' });
    fetchPosts();
  };

  const handleReply = async (postId, commentId) => {
    const token = localStorage.getItem('token');
    await axios.post(`/api/forum/${postId}/comment/${commentId}/reply`, {
      content: replyInputs[commentId]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setReplyInputs({ ...replyInputs, [commentId]: '' });
    fetchPosts();
  };

  const handleReact = async (postId, emoji) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`/api/forum/${postId}/react`, { emoji }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPosts(prev =>
      prev.map(p =>
        p._id === postId ? { ...p, reactions: res.data } : p
      )
    );
  };

  const ReactionBar = ({ post }) => {
    const emojiCounts = emojis.map(e => ({
      emoji: e,
      count: post.reactions?.filter(r => r.emoji === e).length || 0
    }));

    return (
      <div className="flex gap-3 mt-2">
        {emojiCounts.map(({ emoji, count }) => (
          <button
            key={emoji}
            onClick={() => handleReact(post._id, emoji)}
            className="text-xl hover:scale-125 transition"
          >
            {emoji} <span className="text-sm text-gray-500">{count}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🌍 MindMend Community</h2>

      <div className="flex items-center mb-4 gap-3">
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="border rounded px-4 py-2">
          <option value="general">General</option>
          <option value="anxiety">Anxiety Support</option>
          <option value="mindfulness">Mindfulness</option>
          <option value="grief">Grief & Loss</option>
        </select>
        <label className="text-sm flex items-center gap-1">
          <input type="checkbox" checked={anonymous} onChange={() => setAnonymous(!anonymous)} />
          Post Anonymously
        </label>
      </div>

      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        className="w-full border p-3 rounded mb-3"
        placeholder="Share your thoughts... (Markdown supported)"
      />
      <button onClick={handleSubmitPost} className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700">
        Post
      </button>

      <div className="mt-8 space-y-6">
        {posts.map(post => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl shadow"
          >
            <div className="prose">
            <   ReactMarkdown>{post.content}</ReactMarkdown>
            </div>


            <p className="text-xs text-gray-500 mt-1">
              {post.anonymous ? 'Anonymous' : post.author?.name} • {new Date(post.createdAt).toLocaleString()}
            </p>

            <ReactionBar post={post} />

            <div className="mt-4 space-y-2">
              {post.comments.map(c => (
                <div key={c._id} className="ml-4 border-l pl-4">
                  <p className="text-sm text-gray-700">{c.content}</p>
                  <p className="text-xs text-gray-500">
                    {c.user?.name || 'Anonymous'} • {new Date(c.createdAt).toLocaleString()}
                  </p>

                  <div className="ml-4 mt-2 space-y-1">
                    {c.replies.map(r => (
                      <div key={r._id} className="text-sm text-gray-600 border-l pl-3">
                        {r.content} – <span className="text-xs text-gray-400">{r.user?.name || 'Anonymous'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2">
                    <input
                      value={replyInputs[c._id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [c._id]: e.target.value })}
                      className="border px-3 py-1 text-sm rounded mr-2"
                      placeholder="Reply..."
                    />
                    <button
                      onClick={() => handleReply(post._id, c._id)}
                      className="text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <input
                value={commentInputs[post._id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                className="border px-4 py-2 rounded w-full text-sm"
                placeholder="Write a comment..."
              />
              <button
                onClick={() => handleComment(post._id)}
                className="mt-1 bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600 text-sm"
              >
                Comment
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
