import express from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { adminOnly } from '../../middlewares/adminMiddleware.js';
import adminProductRoutes from './productRoutes.js';
import adminCategoryRoutes from './categoryRoutes.js';
import adminOrderRoutes from './orderRoutes.js';
import adminUserRoutes from './userRoutes.js';

/**
 * ============================================
 * ADMIN ROUTES
 * ============================================
 * Main admin router that groups all admin-specific endpoints
 * All routes are protected with authentication + admin role verification
 */

const router = express.Router();

/**
 * Apply authentication middleware to all admin routes
 * Ensures user is logged in and has admin privileges
 */
router.use(authMiddleware);
router.use(adminOnly);

/**
 * Mount admin sub-routes
 * Each route group handles a specific resource type
 */

/**
 * @route   /api/admin/products/*
 * @desc    All product management endpoints
 */
router.use('/products', adminProductRoutes);

/**
 * @route   /api/admin/categories/*
 * @desc    All category management endpoints
 */
router.use('/categories', adminCategoryRoutes);

/**
 * @route   /api/admin/orders/*
 * @desc    All order management endpoints
 */
router.use('/orders', adminOrderRoutes);

/**
 * @route   /api/admin/users/*
 * @desc    All user management endpoints
 */
router.use('/users', adminUserRoutes);

export default router;
