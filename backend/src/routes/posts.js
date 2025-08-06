const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

// Multer storage setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// ✅ Upload post image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// ✅ Create new post
router.post('/', async (req, res) => {
  try {
    const { author, title, content, image } = req.body;

    if (!author || !title || !content) {
      return res.status(400).json({ error: "Author, title, and content are required." });
    }

    const newPost = new Post({ author, title, content, image });
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err); // 🪵 log for debugging
    res.status(500).json({ error: 'Failed to create post', details: err.message });
  }
});

// ✅ Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePic banner'); // <--- Add banner here too
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
