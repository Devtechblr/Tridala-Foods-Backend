/**
 * Admin Access Control Middleware
 * Verifies that the authenticated user has admin role
 * Must be used after the auth middleware to ensure user is authenticated
 *
 * @param {Object} req - Express request object (includes req.user from authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const adminOnly = (req, res, next) => {
  try {
    // Check if user is authenticated (attached by authMiddleware)
    if (!req.user) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      const error = new Error('Access denied. Admin privileges required.');
      error.statusCode = 403; // Forbidden
      throw error;
    }

    // User is admin, proceed to route handler
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Admin operations logger middleware (optional)
 * TODO: Implement admin action logging in Step 2
 * This will track all admin operations for audit purposes
 */
export const adminLogger = (req, res, next) => {
  try {
    // TODO: Log admin action with timestamp and user info
    // TODO: Store in audit log collection
    next();
  } catch (error) {
    next(error);
  }
};
