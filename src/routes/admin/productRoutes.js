import express from 'express';
import {
  createProduct,
  getAllAdminProducts,
  getAdminProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/adminProductController.js';

/**
 * ============================================
 * ADMIN PRODUCT ROUTES
 * ============================================
 * Protected admin-only endpoints for product management
 * All routes require authentication + admin role
 */

const router = express.Router();

/**
 * @route   POST /api/admin/products
 * @desc    Create a new product
 * @access  Admin only
 */
router.post('/', createProduct);

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (admin view with all details)
 * @access  Admin only
 */
router.get('/', getAllAdminProducts);

/**
 * @route   GET /api/admin/products/:id
 * @desc    Get single product by ID
 * @access  Admin only
 */
router.get('/:id', getAdminProductById);

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update product by ID
 * @access  Admin only
 */
router.put('/:id', updateProduct);

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete product by ID
 * @access  Admin only
 */
router.delete('/:id', deleteProduct);

export default router;
