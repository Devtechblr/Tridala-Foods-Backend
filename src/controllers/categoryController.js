import Category from '../models/Category.js';
import mongoose from 'mongoose';

/**
 * ============================================
 * CATEGORY CONTROLLER
 * ============================================
 * Handles all category-related business logic
 * for the Tridala Nutra Foods e-commerce API
 */

/**
 * Get all categories
 *
 * @route   GET /api/categories
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware
 * @returns {JSON} Array of categories with success flag
 */
export const getAllCategories = async (req, res, next) => {
  try {
    // Fetch all categories sorted by creation date (newest first)
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next(error);
  }
};

/**
 * Get a single category by ID
 *
 * @route   GET /api/categories/:id
 * @access  Public
 * @param   {Object} req - Express request object with id parameter
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware
 * @returns {JSON} Single category object with success flag
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid category ID format');
      error.statusCode = 400;
      throw error;
    }

    // Find category by ID
    const category = await Category.findById(id);

    // Handle category not found
    if (!category) {
      const error = new Error(`Category with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next(error);
  }
};

/**
 * Get a single category by slug
 * Useful for frontend navigation
 *
 * @route   GET /api/categories/slug/:slug
 * @access  Public
 * @param   {Object} req - Express request object with slug parameter
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware
 * @returns {JSON} Single category object with success flag
 */
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Validate slug format
    if (!slug || slug.trim().length === 0) {
      const error = new Error('Slug parameter is required');
      error.statusCode = 400;
      throw error;
    }

    // Find category by slug
    const category = await Category.findOne({ slug: slug.toLowerCase() });

    // Handle category not found
    if (!category) {
      const error = new Error(`Category with slug "${slug}" not found`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    // Pass error to global error handler middleware
    next(error);
  }
};
