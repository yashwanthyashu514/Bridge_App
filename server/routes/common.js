const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect } = require('../middleware/auth');

// GET /api/common/announcements  (role-filtered)
router.get('/announcements', protect, async (req, res) => {
  try {
    const role = req.user.role;
    const anns = await Announcement.find({
      sendTo: { $in: ['all', role] }
    }).sort({ createdAt: -1 }).limit(50);
    res.json(anns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
