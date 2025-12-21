import Blog from '../Models/Blog.js';

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      // Handle featured image from file upload
      featuredImage: req.file ? `/uploads/blog-images/${req.file.filename}` : req.body.featuredImage
    };

    const blog = await Blog.create(blogData);
    
    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all blogs with filtering
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      isFeatured, 
      tag, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (isFeatured) query.isFeatured = isFeatured === 'true';
    if (tag) query.tags = tag;
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Blog.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single blog by slug or ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req, res) => {
  try {
    let blog;
    
    // Check if it's a valid MongoDB ID
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(req.params.id);
    } else {
      // If not an ID, try to find by slug
      blog = await Blog.findOne({ slug: req.params.id });
    }
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      // Update featured image if new file uploaded
      featuredImage: req.file ? `/uploads/blog-images/${req.file.filename}` : req.body.featuredImage
    };
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog,
      message: 'Blog updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      isFeatured: true, 
      status: 'published' 
    })
    .sort({ publishDate: -1 })
    .limit(10)
    .select('-__v');
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get blogs by category
// @route   GET /api/blogs/category/:category
// @access  Public
export const getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      category: req.params.category,
      status: 'published' 
    })
    .sort({ publishDate: -1 })
    .select('-__v');
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get blogs by tag
// @route   GET /api/blogs/tag/:tag
// @access  Public
export const getBlogsByTag = async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      tags: req.params.tag.toLowerCase(),
      status: 'published' 
    })
    .sort({ publishDate: -1 })
    .select('-__v');
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};