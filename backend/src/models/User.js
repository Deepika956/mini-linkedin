const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  // 🔥 THESE are what you're missing 👇
  bio: {
    type: String,
    default: "No bio"
  },
  location: {
    type: String,
    default: "No location"
  },
  banner: {
    type: String,
    default: ""
  },
  profilePic: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('User', userSchema);
