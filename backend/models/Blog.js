import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technology', 'food', 'travel', 'health', 'lifestyle', 'business', 'education', 'entertainment', 'sports', 'science']
  },
  tags: [{
    type: String,
    trim: true
  }],
  coverImage: {
    type: String,
    default: 'https://picsum.photos/800/400'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  published: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  }
}, {
  timestamps: true
});

// Index for search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ author: 1, createdAt: -1 });

// Calculate read time based on content
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
