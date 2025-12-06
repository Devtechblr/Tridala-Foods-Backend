import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * ============================================
 * AUTH CONTROLLER
 * ============================================
 * Handles user authentication (register, login, profile)
 * Uses JWT for secure token-based authentication
 */

/**
 * Register a new user
 *
 * @route   POST /api/auth/register
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware
 * @returns {JSON} User info and JWT token
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.statusCode = 400;
      throw error;
    }

    // Validate password length
    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.statusCode = 400;
      throw error;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('Email already registered. Please login or use a different email.');
      error.statusCode = 409; // Conflict
      throw error;
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by pre-save hook
      phone: phone ? phone.trim() : undefined,
    });

    // Save user to database (password gets hashed in pre-save hook)
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user info (password excluded due to select: false)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user with email and password
 *
 * @route   POST /api/auth/login
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware
 * @returns {JSON} User info and JWT token
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    // Find user by email and include password (normally excluded)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    // Check if user exists
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Compare password using the schema method
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user info (password excluded)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged-in user profile
 * Protected route - requires valid JWT token
 *
 * @route   GET /api/auth/me
 * @access  Private (requires authentication)
 * @param   {Object} req - Express request object (includes req.user from middleware)
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware
 * @returns {JSON} Current user info
 */
export const getProfile = async (req, res, next) => {
  try {
    // User is already attached to request by authMiddleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
