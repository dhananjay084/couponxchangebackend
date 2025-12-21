import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: 3,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
 
  category: {
    type: String,
    default: 'other',
    trim: true
    // Remove the enum constraint to allow any value
  },
  featuredImage: {
    type: String,
    default: null
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: 10
  },
  excerpt: {
    type: String,
    maxlength: 200,
    default: ''
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    const slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Add timestamp for uniqueness
    this.slug = `${slug}-${Date.now().toString().slice(-6)}`;
  }
  
  // Calculate reading time (assuming 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

// Add text index for search functionality
blogSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text', 
  tags: 'text' 
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;