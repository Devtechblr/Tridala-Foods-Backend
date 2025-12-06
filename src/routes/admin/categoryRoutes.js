import express from 'express';
import {
  createCategory,
  getAllAdminCategories,
  updateCategory,
  deleteCategory,
} from '../../controllers/adminCategoryController.js';

/**
 * ============================================
 * ADMIN CATEGORY ROUTES
 * ============================================
 * Protected admin-only endpoints for category management
 * All routes require authentication + admin role
 */

const router = express.Router();

/**
 * @route   POST /api/admin/categories
 * @desc    Create a new category
 * @access  Admin only
 */
router.post('/', createCategory);

/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories (admin view with all details)
 * @access  Admin only
 */
router.get('/', getAllAdminCategories);

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update category by ID
 * @access  Admin only
 */
router.put('/:id', updateCategory);

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete category by ID
 * @access  Admin only
 */
router.delete('/:id', deleteCategory);

export default router;
