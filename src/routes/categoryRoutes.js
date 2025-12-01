import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
} from '../controllers/categoryController.js';

/**
 * ============================================
 * CATEGORY ROUTES
 * ============================================
 * RESTful API endpoints for category operations
 * Public read-only access for now
 */

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Fetch all categories
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Fetch a single category by MongoDB ObjectId
 * @access  Public
 */
router.get('/:id', getCategoryById);

/**
 * @route   GET /api/categories/slug/:slug
 * @desc    Fetch a single category by URL-friendly slug
 * @access  Public
 */
router.get('/slug/:slug', getCategoryBySlug);

export default router;
