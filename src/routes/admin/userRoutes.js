import express from 'express';
import {
  getAllAdminUsers,
  getAdminUserById,
  updateUserRole,
} from '../../controllers/adminUserController.js';

/**
 * ============================================
 * ADMIN USER ROUTES
 * ============================================
 * Protected admin-only endpoints for user management
 * All routes require authentication + admin role
 */

const router = express.Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (admin view with all details)
 * @access  Admin only
 */
router.get('/', getAllAdminUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user by ID
 * @access  Admin only
 */
router.get('/:id', getAdminUserById);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Admin only
 */
router.put('/:id/role', updateUserRole);

export default router;
