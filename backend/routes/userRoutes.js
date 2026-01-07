import express from 'express';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('blogs', 'title category createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('blogs', 'title content excerpt category coverImage views likes createdAt');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const { username, email, password, fullName, bio } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    
    const user = new User({
      username,
      email,
      password, // In production, hash this!
      fullName,
      bio,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=667eea&color=fff`
    });
    
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { fullName, bio, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, bio, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's blogs
router.get('/:id/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.id })
      .populate('author', 'username fullName avatar')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
