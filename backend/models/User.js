import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User'
  },
  bio: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  favoriteBlogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
}, {
  timestamps: true
});

// Virtual for blog count
userSchema.virtual('blogCount').get(function() {
  return this.blogs ? this.blogs.length : 0;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
