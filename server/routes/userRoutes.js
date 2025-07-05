import {matchTherapists} from '../controllers/userController.js'

router.post('/match-therapists', protect, matchTherapists);
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch user' });
  }
});

