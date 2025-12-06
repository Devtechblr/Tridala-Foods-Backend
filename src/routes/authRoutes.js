import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

/**
 * ============================================
 * AUTH ROUTES
 * ============================================
 * Authentication endpoints for user registration, login, and profile
 * Includes JWT-based token authentication
 */

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @body    { name, email, password, phone }
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and receive JWT token
 * @body    { email, password }
 * @access  Public
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user's profile
 * @access  Private (requires JWT token)
 * @header  Authorization: Bearer <token>
 */
router.get('/me', authMiddleware, getProfile);

export default router;
