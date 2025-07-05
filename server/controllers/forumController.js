import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  const { content, topic, anonymous } = req.body;
  const post = await Post.create({
    author: req.user._id,
    content, topic, anonymous
  });
  res.json(post);
};

export const getPostsByTopic = async (req, res) => {
  const posts = await Post.find({ topic: req.params.topic })
    .populate('author', 'name')
    .populate('comments.user', 'name')
    .populate('comments.replies.user', 'name'); // 👈 Add this line
  res.json(posts);
};


export const commentOnPost = async (req, res) => {
  const { content } = req.body;
  const post = await Post.findById(req.params.postId);
  post.comments.push({
    user: req.user._id,
    content 
  });
  await post.save();
  res.json(post);
};

export const reportPost = async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post.reports.includes(req.user._id)) {
    post.reports.push(req.user._id);
    await post.save();
  }
  res.json({ msg: 'Reported' });
};

export const replyComment = async (req, res) => {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.id(req.params.commentId);
    comment.replies.push({ user: req.user._id, content });
    await post.save();
    res.json(post);
};

export const reactToPost = async (req, res) => {
  const { emoji } = req.body;
  const userId = req.user._id;
  const post = await Post.findById(req.params.postId);

  const existing = post.reactions.find(r => r.user.toString() === userId.toString());

  if (existing) {
    if (existing.emoji === emoji) {
      // Remove reaction if same emoji clicked again
      post.reactions = post.reactions.filter(r => r.user.toString() !== userId.toString());
    } else {
      // Update emoji
      existing.emoji = emoji;
    }
  } else {
    post.reactions.push({ user: userId, emoji });
  }

  await post.save();
  res.json(post.reactions);
};

