import mongoose from 'mongoose';
import Order from '../models/Order.js';
import {
  ORDER_STATUSES,
  isValidOrderStatus,
  isValidStatusTransition,
  getStatusLabel,
  formatOrderResponse,
} from '../utils/orderUtils.js';

/**
 * ============================================
 * ADMIN ORDER CONTROLLER
 * ============================================
 * Handles all admin order management operations
 * Implements complete order viewing and status management functionality
 */

// Convert ORDER_STATUSES object to array for backward compatibility
const VALID_STATUSES = Object.values(ORDER_STATUSES);

/**
 * Get all orders with filtering and pagination
 * Returns all orders with user and product details
 * Supports status filtering, date range filtering, and pagination
 *
 * @route   GET /api/admin/orders
 * @access  Admin only
 *
 * @query {number} page - Page number for pagination (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @query {string} status - Filter by order status (pending, processing, shipped, delivered, cancelled, refunded)
 * @query {string} from - Start date filter (YYYY-MM-DD)
 * @query {string} to - End date filter (YYYY-MM-DD)
 * @query {string} search - Search by user email or order ID
 */
export const getAllAdminOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, from, to, search } = req.query;

    // Parse pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter = {};

    // Status filter
    if (status && VALID_STATUSES.includes(status)) {
      filter.status = status;
    }

    // Date range filter
    if (from || to) {
      filter.createdAt = {};

      if (from) {
        const fromDate = new Date(from);
        if (!isNaN(fromDate)) {
          filter.createdAt.$gte = fromDate;
        }
      }

      if (to) {
        const toDate = new Date(to);
        if (!isNaN(toDate)) {
          // Set to end of day
          toDate.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = toDate;
        }
      }
    }

    // Search filter - search by order ID or user email
    if (search) {
      // Check if search is a valid ObjectId (for order ID search)
      if (mongoose.Types.ObjectId.isValid(search)) {
        filter._id = search;
      } else {
        // Search by user email (will need to use aggregation for this)
        // For now, we'll use a regex match on userId if it's an ObjectId
        // In future, can implement full text search or aggregation pipeline
      }
    }

    // Execute query with filters, pagination, and sorting
    const orders = await Order.find(filter)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination info
    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single order by ID with full details
 * Returns complete order information including user and product details
 *
 * @route   GET /api/admin/orders/:id
 * @access  Admin only
 *
 * @param {string} id - Order ID (MongoDB ObjectId)
 */
export const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    // Fetch order with populated user and product details
    const order = await Order.findById(id)
      .populate('userId', 'name email phone role')
      .populate('items.productId', 'name price salePrice category stock');

    // Return 404 if order not found
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status
 * Validates status and updates the order with new status
 * Only allows updating to valid status values
 *
 * @route   PUT /api/admin/orders/:id/status
 * @access  Admin only
 *
 * @param {string} id - Order ID (MongoDB ObjectId)
 * @param {string} status - New order status (pending, processing, shipped, delivered, cancelled, refunded)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    // Validate status is provided
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    // Validate status is one of the allowed values
    if (!isValidOrderStatus(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // Check if order exists
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Validate status transition
    if (!isValidStatusTransition(order.status, status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${getStatusLabel(order.status)} to ${getStatusLabel(status)}`,
      });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Populate user details before sending response
    await order.populate('userId', 'name email phone');
    await order.populate('items.productId', 'name price images');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * TODO: Future admin order features
 * 
 * - assignDeliveryPersonnel()
 *   Assign a delivery person to an order for logistics tracking
 *   Update order with delivery personnel details
 * 
 * - updateTrackingId()
 *   Store/update tracking ID from logistics provider
 *   Send tracking info to customer via email/SMS
 * 
 * - initiateRefund()
 *   Process refund for cancelled/returned orders
 *   Update payment status and order status
 *   Send refund confirmation to customer
 * 
 * - getOrderTimeline()
 *   Retrieve status change history for an order
 *   Show timestamps and admin user who made changes
 *   Display current status progression
 * 
 * - exportOrders()
 *   Export orders to CSV/Excel for reporting
 *   Filter and format data for business analysis
 *   Generate sales/order reports
 * 
 * - bulkUpdateStatus()
 *   Update status for multiple orders at once
 *   Useful for batch processing orders
 *   Generate audit trail for bulk operations
 */

