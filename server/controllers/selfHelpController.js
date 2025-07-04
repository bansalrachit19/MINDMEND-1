import SelfHelp from '../models/SelfHelp.js';

export const createResource = async (req, res) => {
  try {
    const { title, type, link, description } = req.body;
    const newResource = new SelfHelp({
      title,
      type,
      link,
      description,
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
