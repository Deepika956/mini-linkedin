const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Post = require('../models/Post');

// Multer storage config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// ✅ Get user and posts
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// ✅ Update user details
// In routes/users.js
router.put('/update/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          name: req.body.name,
          bio: req.body.bio || '',
          location: req.body.location || '',
          banner: req.body.banner || '',
          profilePic: req.body.profilePic || '', // ✅ This line is key!
        }
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error("Failed to update user:", err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ✅ Upload banner
router.post('/upload/banner', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// ✅ Upload profile
router.post('/upload/profile', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
