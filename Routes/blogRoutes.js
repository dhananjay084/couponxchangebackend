import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
  getBlogsByCategory,
  getBlogsByTag
} from '../Controllers/blogController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/category/:category', getBlogsByCategory);
router.get('/tag/:tag', getBlogsByTag);
router.get('/:id', getBlog);

// Protected routes (add authentication middleware as needed)
router.post('/', upload.single('image'), createBlog);
router.put('/:id', upload.single('image'), updateBlog);
router.delete('/:id', deleteBlog);

export default router;