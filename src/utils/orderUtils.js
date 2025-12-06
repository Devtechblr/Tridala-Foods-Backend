/**
 * ============================================
 * ORDER UTILITIES
 * ============================================
 * Helper functions for order management
 * Includes validation, filtering, and status management
 */

/**
 * Valid order statuses
 * Used throughout the application for consistency
 */
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

/**
 * Valid payment statuses
 */
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

/**
 * Valid payment methods
 */
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  WALLET: 'wallet',
  COD: 'cod', // Cash on Delivery
};

/**
 * Validate if a status is valid
 * @param {string} status - Status to validate
 * @returns {boolean} - True if status is valid
 */
export const isValidOrderStatus = (status) => {
  return Object.values(ORDER_STATUSES).includes(status);
};

/**
 * Validate if a payment status is valid
 * @param {string} status - Payment status to validate
 * @returns {boolean} - True if payment status is valid
 */
export const isValidPaymentStatus = (status) => {
  return Object.values(PAYMENT_STATUSES).includes(status);
};

/**
 * Validate if a payment method is valid
 * @param {string} method - Payment method to validate
 * @returns {boolean} - True if payment method is valid
 */
export const isValidPaymentMethod = (method) => {
  return Object.values(PAYMENT_METHODS).includes(method);
};

/**
 * Get readable status label
 * Converts status to human-readable format
 * @param {string} status - Order status
 * @returns {string} - Human-readable status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    [ORDER_STATUSES.PENDING]: 'Pending',
    [ORDER_STATUSES.PROCESSING]: 'Processing',
    [ORDER_STATUSES.SHIPPED]: 'Shipped',
    [ORDER_STATUSES.DELIVERED]: 'Delivered',
    [ORDER_STATUSES.CANCELLED]: 'Cancelled',
    [ORDER_STATUSES.REFUNDED]: 'Refunded',
  };
  return labels[status] || status;
};

/**
 * Check if status transition is valid
 * Prevents invalid status transitions
 * @param {string} currentStatus - Current order status
 * @param {string} newStatus - New order status
 * @returns {boolean} - True if transition is valid
 */
export const isValidStatusTransition = (currentStatus, newStatus) => {
  // Define allowed transitions
  const allowedTransitions = {
    [ORDER_STATUSES.PENDING]: [
      ORDER_STATUSES.PROCESSING,
      ORDER_STATUSES.CANCELLED,
    ],
    [ORDER_STATUSES.PROCESSING]: [
      ORDER_STATUSES.SHIPPED,
      ORDER_STATUSES.CANCELLED,
    ],
    [ORDER_STATUSES.SHIPPED]: [
      ORDER_STATUSES.DELIVERED,
      ORDER_STATUSES.CANCELLED,
    ],
    [ORDER_STATUSES.DELIVERED]: [
      ORDER_STATUSES.REFUNDED,
    ],
    [ORDER_STATUSES.CANCELLED]: [
      ORDER_STATUSES.PENDING, // Can reopen cancelled order
    ],
    [ORDER_STATUSES.REFUNDED]: [], // No further transitions
  };

  const allowed = allowedTransitions[currentStatus] || [];
  return allowed.includes(newStatus);
};

/**
 * Format order data for API response
 * Removes sensitive information and formats dates
 * @param {Object} order - Order document
 * @returns {Object} - Formatted order data
 */
export const formatOrderResponse = (order) => {
  return {
    _id: order._id,
    userId: order.userId,
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    shippingAddress: order.shippingAddress,
    trackingId: order.trackingId,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

/**
 * Calculate order statistics
 * Useful for admin dashboard
 * @param {Array} orders - Array of order documents
 * @returns {Object} - Order statistics
 */
export const calculateOrderStats = (orders) => {
  const stats = {
    total: orders.length,
    byStatus: {},
    byPaymentStatus: {},
    totalRevenue: 0,
  };

  // Initialize status counts
  Object.values(ORDER_STATUSES).forEach((status) => {
    stats.byStatus[status] = 0;
  });

  Object.values(PAYMENT_STATUSES).forEach((status) => {
    stats.byPaymentStatus[status] = 0;
  });

  // Calculate statistics
  orders.forEach((order) => {
    stats.byStatus[order.status]++;
    stats.byPaymentStatus[order.paymentStatus]++;
    if (order.status === ORDER_STATUSES.DELIVERED || order.status === ORDER_STATUSES.REFUNDED) {
      stats.totalRevenue += order.totalAmount;
    }
  });

  return stats;
};
