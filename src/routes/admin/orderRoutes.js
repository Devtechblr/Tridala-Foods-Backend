import express from 'express';
import {
  getAllAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
} from '../../controllers/adminOrderController.js';

/**
 * ============================================
 * ADMIN ORDER ROUTES
 * ============================================
 * Protected admin-only endpoints for order management
 * All routes require authentication + admin role
 */

const router = express.Router();

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders (admin view with all details)
 * @access  Admin only
 */
router.get('/', getAllAdminOrders);

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get single order by ID
 * @access  Admin only
 */
router.get('/:id', getAdminOrderById);

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status
 * @access  Admin only
 */
router.put('/:id/status', updateOrderStatus);

export default router;
