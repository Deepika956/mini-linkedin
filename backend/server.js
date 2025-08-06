const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');     // ✅ Login/Register
const userRoutes = require('./src/routes/users');    // ✅ User info, profile update
const postRoutes = require('./src/routes/posts'); 
const uploadRoutes = require('./src/routes/upload');   // ✅ Posts + image upload

const app = express();

// ✅ Middleware
app.use(cors({
  origin: ['http://localhost:3000',
  'https://mini-linkedin-1-qq8q.onrender.com'],
  credentials: true,
}));
app.use(express.json());

// ✅ Serve uploaded images (e.g., /uploads/image.jpg)
app.use('/uploads', express.static('uploads'));

// ✅ Route handlers
app.use('/api/auth', authRoutes);     // e.g. /api/auth/login
app.use('/api/users', userRoutes);    // e.g. /api/users/update/:id
app.use('/api/posts', postRoutes); 
app.use('/api/uploads', uploadRoutes);   // e.g. /api/posts + /api/posts/upload

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



