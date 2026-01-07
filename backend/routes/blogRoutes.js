import express from 'express';
import Blog from '../models/Blog.js';
import User from '../models/User.js';

const router = express.Router();

// Get all blogs with filters
router.get('/', async (req, res) => {
  try {
    const { category, author, search, featured, limit = 50, page = 1 } = req.query;
    
    let query = { published: true };
    
    if (category && category !== 'all') query.category = category;
    if (author) query.author = author;
    if (featured) query.featured = featured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'username fullName avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    const total = await Blog.countDocuments(query);
    
    res.json({ 
      success: true, 
      blogs: blogs || [],
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, error: error.message, blogs: [] });
  }
});

// Get blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username fullName avatar bio');
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create blog
router.post('/', async (req, res) => {
  try {
    const { title, content, excerpt, author, category, tags, coverImage } = req.body;
    
    const blog = new Blog({
      title,
      content,
      excerpt,
      author,
      category,
      tags: tags || [],
      coverImage: coverImage || `https://picsum.photos/seed/${Date.now()}/800/400`
    });
    
    await blog.save();
    
    // Add blog to user's blogs array
    await User.findByIdAndUpdate(author, {
      $push: { blogs: blog._id }
    });
    
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username fullName avatar');
    
    res.status(201).json({ success: true, blog: populatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update blog
router.put('/:id', async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, coverImage, published, featured } = req.body;
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, excerpt, category, tags, coverImage, published, featured },
      { new: true, runValidators: true }
    ).populate('author', 'username fullName avatar');
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    // Remove blog from user's blogs array
    await User.findByIdAndUpdate(blog.author, {
      $pull: { blogs: blog._id }
    });
    
    await blog.deleteOne();
    
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Like blog
router.post('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    ).populate('author', 'username fullName avatar');
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get related blogs
router.get('/:id/related', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      $or: [
        { category: blog.category },
        { tags: { $in: blog.tags } }
      ],
      published: true
    })
    .populate('author', 'username fullName avatar')
    .limit(5)
    .sort({ views: -1 });
    
    res.json({ success: true, blogs: relatedBlogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get categories with count
router.get('/stats/categories', async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
