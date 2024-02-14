import express from 'express';
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post/post.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPost);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
