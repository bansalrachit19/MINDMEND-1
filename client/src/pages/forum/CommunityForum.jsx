import { useState, useEffect } from "react";
import axios from "axios";
const base = import.meta.env.VITE_API_BASE_URL;
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
const emojis = ["❤️", "😂", "😢", "😡"];
export default function CommunityForum() {
  const [topic, setTopic] = useState("general");
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  useEffect(() => {
    fetchPosts();
  }, [topic]);
  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${base}/api/forum/topic/${topic}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetched posts:", res.data);
    setPosts(res.data);
  };
  const handleSubmitPost = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${base}/api/forum/create`,
      { content: newPost, topic, anonymous },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewPost("");
    fetchPosts();
  };
  const handleComment = async (postId) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${base}/api/forum/${postId}/comment`,
      { content: commentInputs[postId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCommentInputs({ ...commentInputs, [postId]: "" });
    fetchPosts();
  };
  const handleReply = async (postId, commentId) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${base}/api/forum/${postId}/comment/${commentId}/reply`,
      { content: replyInputs[commentId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReplyInputs({ ...replyInputs, [commentId]: "" });
    fetchPosts();
  };
  const handleReact = async (postId, emoji) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${base}/api/forum/${postId}/react`,
      { emoji },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, reactions: res.data } : p))
    );
  };
  const ReactionBar = ({ post }) => {
    const emojiCounts = emojis.map((e) => ({
      emoji: e,
      count: post.reactions?.filter((r) => r.emoji === e).length || 0,
    }));
    return (
      <div className="flex gap-3 mt-2">
        {" "}
        {emojiCounts.map(({ emoji, count }) => (
          <button
            key={emoji}
            onClick={() => handleReact(post._id, emoji)}
            className="text-xl hover:scale-125 transition"
          >
            {" "}
            {emoji} <span className="text-sm text-gray-500">{count}</span>{" "}
          </button>
        ))}{" "}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-100 py-12 px-4 sm:px-8 lg:px-16">
      {" "}
      <motion.h2
        className="text-4xl font-bold text-center text-purple-800 mb-10 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {" "}
        <Sparkles className="text-purple-600 w-6 h-6 animate-bounce" /> MindMend
        Community Forum{" "}
      </motion.h2>{" "}
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
        {" "}
        <div className="flex flex-wrap items-center mb-4 gap-3">
          {" "}
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border border-purple-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {" "}
            <option value="general">🌐 General</option>{" "}
            <option value="anxiety">😟 Anxiety Support</option>{" "}
            <option value="mindfulness">🧘 Mindfulness</option>{" "}
            <option value="grief">💔 Grief & Loss</option>{" "}
          </select>{" "}
          <label className="text-sm flex items-center gap-2">
            {" "}
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
              className="accent-purple-500"
            />{" "}
            Post Anonymously{" "}
          </label>{" "}
        </div>{" "}
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full border border-purple-200 rounded-xl p-4 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
          rows={3}
          placeholder="Share your thoughts... (Markdown supported)"
        />{" "}
        <button
          onClick={handleSubmitPost}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition font-medium"
        >
          {" "}
          Post{" "}
        </button>{" "}
      </div>{" "}
      <div className="mt-10 space-y-6 max-w-3xl mx-auto">
        {" "}
        {posts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-2xl shadow-md border border-purple-100"
          >
            {" "}
            <div className="prose prose-sm max-w-full text-gray-800">
              {" "}
              <ReactMarkdown>{post.content}</ReactMarkdown>{" "}
            </div>{" "}
            <p className="text-xs text-gray-500 mt-1">
              {" "}
              {post.anonymous === true ? "Anonymous" : post.author?.name} •{" "}
              {new Date(post.createdAt).toLocaleString()}{" "}
            </p>{" "}
            <ReactionBar post={post} />{" "}
            <div className="mt-4 space-y-2">
              {" "}
              {post.comments.map((c) => (
                <div
                  key={c._id}
                  className="ml-4 border-l-4 border-purple-200 pl-4"
                >
                  {" "}
                  <p className="text-sm text-gray-700">{c.content}</p>{" "}
                  <p className="text-xs text-gray-400">
                    {" "}
                    {c.user?.name || "Anonymous"} •{" "}
                    {new Date(c.createdAt).toLocaleString()}{" "}
                  </p>{" "}
                  <div className="ml-4 mt-2 space-y-1">
                    {" "}
                    {c.replies.map((r) => (
                      <div
                        key={r._id}
                        className="text-sm text-gray-600 border-l-2 border-purple-100 pl-3"
                      >
                        {" "}
                        {r.content} –{" "}
                        <span className="text-xs text-gray-400">
                          {r.user?.name || "Anonymous"}
                        </span>{" "}
                      </div>
                    ))}{" "}
                  </div>{" "}
                  <div className="mt-2">
                    {" "}
                    <input
                      value={replyInputs[c._id] || ""}
                      onChange={(e) =>
                        setReplyInputs({
                          ...replyInputs,
                          [c._id]: e.target.value,
                        })
                      }
                      className="border border-purple-200 px-3 py-1 text-sm rounded mr-2 w-64"
                      placeholder="Reply..."
                    />{" "}
                    <button
                      onClick={() => handleReply(post._id, c._id)}
                      className="text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition"
                    >
                      {" "}
                      Reply{" "}
                    </button>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            <div className="mt-4">
              {" "}
              <input
                value={commentInputs[post._id] || ""}
                onChange={(e) =>
                  setCommentInputs({
                    ...commentInputs,
                    [post._id]: e.target.value,
                  })
                }
                className="border border-purple-200 px-4 py-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Write a comment..."
              />{" "}
              <button
                onClick={() => handleComment(post._id)}
                className="mt-2 bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600 text-sm"
              >
                {" "}
                Comment{" "}
              </button>{" "}
            </div>{" "}
          </motion.div>
        ))}{" "}
      </div>{" "}
    </div>
  );
}
