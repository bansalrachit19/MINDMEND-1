  import Post from '../models/Post.js';

  export const createPost = async (req, res) => {
    const { content, topic, anonymous } = req.body;
    const post = await Post.create({
      author: req.user._id,
      content, topic, anonymous
    });
    const populatedPost = await Post.findById(post._id).populate('author', 'name');
    console.log(populatedPost);
    res.json(populatedPost);
  };

  export const getPostsByTopic = async (req, res) => {
    const posts = await Post.find({ topic: req.params.topic })
      .populate('author', 'name')
      .populate('comments.user', 'name')
      .populate('comments.replies.user', 'name');
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

    const updated = await Post.findById(post._id)
      .populate('author', 'name')
      .populate('comments.user', 'name')
      .populate('comments.replies.user', 'name');
    
    res.json(updated);
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
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    await Post.updateOne(
      { _id: req.params.postId, 'comments._id': req.params.commentId },
      {
        $push: {
          'comments.$.replies': {
            user: req.user._id,
            content,
            createdAt: new Date(),
          },
        },
      }
    );

    const updated = await Post.findById(req.params.postId)
      .populate('author', 'name')
      .populate('comments.user', 'name')
      .populate('comments.replies.user', 'name');

    res.json(updated);
  };

  export const reactToPost = async (req, res) => {
  const { emoji } = req.body;
  const userId = req.user._id;
  const postId = req.params.postId;

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ msg: 'Post not found' });

  const existing = post.reactions.find(
    (r) => r.user && r.user.toString() === userId.toString()
  );

  if (existing) {
    if (existing.emoji === emoji) {
      await Post.updateOne(
        { _id: postId },
        { $pull: { reactions: { user: userId } } }
      );
    } else {
      await Post.updateOne(
        { _id: postId, 'reactions.user': userId },
        { $set: { 'reactions.$.emoji': emoji } }
      );
    }
  } else {
    await Post.updateOne(
      { _id: postId },
      {
        $push: {
          reactions: {
            user: userId,
            emoji,
          },
        },
      }
    );
  }

  const updated = await Post.findById(postId).select('reactions');
  res.json(updated.reactions);
};

