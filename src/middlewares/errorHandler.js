/**
 * Global Error Handling Middleware
 * Catches all errors thrown in route handlers and middlewares
 * Returns consistent JSON error response format
 *
 * @param {Error} error - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function globalErrorHandler(error, req, res, next) {
  // Default status code is 500 (Internal Server Error)
  const statusCode = error.statusCode || 500;

  // Log error details in development environment
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      statusCode,
      stack: error.stack,
    });
  } else {
    // In production, log minimal details
    console.error('Error:', error.message);
  }

  // Send error response to client
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}

export default globalErrorHandler;
