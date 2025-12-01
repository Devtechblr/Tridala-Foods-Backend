import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
} from '../controllers/productController.js';

/**
 * ============================================
 * PRODUCT ROUTES
 * ============================================
 * RESTful API endpoints for product operations
 * Public read-only access for now
 * Admin CRUD operations will be added later
 */

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Fetch all products with filtering, searching, and sorting
 * @query   ?category=categoryId - Filter by category
 * @query   ?search=keyword - Search by name, tags, description
 * @query   ?sort=price or -price - Sort by field (- for descending)
 * @query   ?limit=20 - Limit results (max 100)
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/search/advanced
 * @desc    Advanced search with multiple filters
 * @query   ?q=keyword - Full-text search query
 * @query   ?minPrice=0 - Minimum price filter
 * @query   ?maxPrice=10000 - Maximum price filter
 * @query   ?category=categoryId - Filter by category
 * @access  Public
 */
router.get('/search/advanced', searchProducts);

/**
 * @route   GET /api/products/category/:categoryId
 * @desc    Fetch all products in a specific category
 * @query   ?sort=price - Sort by field
 * @query   ?limit=20 - Limit results
 * @access  Public
 */
router.get('/category/:categoryId', getProductsByCategory);

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Fetch a single product by URL-friendly slug
 * @access  Public
 */
router.get('/slug/:slug', getProductBySlug);

/**
 * @route   GET /api/products/:id
 * @desc    Fetch a single product by MongoDB ObjectId
 * @access  Public
 */
router.get('/:id', getProductById);

export default router;
