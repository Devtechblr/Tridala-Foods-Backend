import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request object
 * Must be used on protected routes
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // Check if token exists
    if (!token) {
      const error = new Error('No token provided. Please login first.');
      error.statusCode = 401;
      throw error;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database (exclude password)
    const user = await User.findById(decoded.id);

    // Check if user still exists
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    // Attach user to request object for use in route handlers
    req.user = user;

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      const err = new Error('Invalid token');
      err.statusCode = 401;
      return next(err);
    }

    if (error.name === 'TokenExpiredError') {
      const err = new Error('Token has expired. Please login again.');
      err.statusCode = 401;
      return next(err);
    }

    // Pass all other errors to global error handler
    next(error);
  }
};

/**
 * Optional Auth Middleware
 * Attempts to authenticate but doesn't fail if token is missing
 * Useful for endpoints that can work with or without authentication
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Silently fail and continue - user is optional
    next();
  }
};
