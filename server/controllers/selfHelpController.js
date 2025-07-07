import SelfHelp from '../models/SelfHelp.js';
import MoodEntry from '../models/MoodEntry.js'; 

export const createResource = async (req, res) => {
  try {
    const { title, type, link, description, suggestedFor } = req.body;
    const newResource = new SelfHelp({
      title,
      type,
      suggestedFor: [suggestedFor],
      link,
      description,
      approved: true,
      isAI: false,
      createdBy: req.user.id
    });
    await newResource.save();
    res.json({ msg: 'Resource uploaded successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Upload failed' });
  }
};

export const getAllResources = async (req, res) => {
  const resources = await SelfHelp.find().sort({ createdAt: -1 });
  res.json(resources);
};

export const deleteResource = async (req, res) => {
  try {
    await SelfHelp.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed' });
  }
};

export const suggestResourcesByAI = async (req, res) => {
  const { category } = req.body; // 'happy', 'self', 'need'

  const suggestions = {
    happy: [
      {
        title: "Boost Productivity with Morning Routines",
        type: "video",
        link: "https://youtu.be/mMGhOeFQIv8?si=0VvM8bcDbj1mevqu",
        description: "A cheerful video to supercharge your mornings.",
        suggestedFor: ['happy'],
        isAI: true,
        approved: false
      }
    ],
    self: [
      {
        title: "Deep Breathing to Calm Anxiety",
        type: "meditation",
        link: "https://www.youtube.com/watch?v=self-video",
        description: "Guided breathing to reduce stress and clear the mind.",
        suggestedFor: ['self'],
        isAI: true,
        approved: false
      }
    ],
    need: [
      {
        title: "Coping with Depression: A Gentle Guide",
        type: "article",
        link: "https://example.com/need-article",
        description: "An insightful read for when you need professional help.",
        suggestedFor: ['need'],
        isAI: true,
        approved: false
      }
    ]
  };

  const toInsert = suggestions[category] || [];

  const saved = await SelfHelp.insertMany(toInsert);
  res.json(saved);
};

export const approveSelfHelpResource = async (req, res) => {
  try {
    await SelfHelp.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ msg: 'Approved' });
  } catch (err) {
    res.status(500).json({ msg: 'Error approving resource' });
  }
};

export const getResourcesForUserMood = async (req, res) => {
  try {
    const latestMood = req.query.mood;
    console.log(latestMood);
    if (!latestMood) {
      return res.json([]); // fallback for users with no mood data
    }

    const resources = await SelfHelp.find({
      approved: true,
      suggestedFor: latestMood
    });

    console.log("suggested resources", resources);

    res.json(resources);
  } catch (err) {
    console.error('Failed to fetch user-matched resources:', err);
    res.status(500).json({ msg: 'Error fetching resources' });
  }
};


