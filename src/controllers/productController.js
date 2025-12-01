import Product from '../models/Product.js';
import mongoose from 'mongoose';

/**
 * ============================================
 * PRODUCT CONTROLLER
 * ============================================
 * Handles all product-related business logic
 * Supports filtering, searching, and sorting
 */

/**
 * Get all products with filtering, searching, and sorting
 *
 * @route   GET /api/products
 * @access  Public
 * @query   {String} category - Filter by category ObjectId
 * @query   {String} search - Search in name, tags, description
 * @query   {String} sort - Sort by field (e.g., "price" or "-price" for descending)
 * @query   {Number} limit - Limit number of results (default: 20, max: 100)
 * @returns {JSON} Array of products with success flag and count
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, sort, limit } = req.query;

    // Initialize filter object
    let filter = {};

    // Filter by category if provided
    if (category) {
      // Validate category ID format
      if (!mongoose.Types.ObjectId.isValid(category)) {
        const error = new Error('Invalid category ID format');
        error.statusCode = 400;
        throw error;
      }
      filter.category = category;
    }

    // Search functionality using text search
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Determine sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort) {
      const sortBy = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;

      // Whitelist allowed sort fields for security
      const allowedSortFields = ['price', 'name', 'createdAt', 'stock'];
      if (allowedSortFields.includes(sortBy)) {
        sortOption = { [sortBy]: sortOrder };
      }
    }

    // Determine limit (max 100, default 20)
    let limitValue = 20;
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limitValue = Math.min(parsedLimit, 100);
      }
    }

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(limitValue)
      .lean(); // Use lean() for better performance in read-only queries

    // Get total count for pagination info
    const totalCount = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalCount,
      limit: limitValue,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single product by MongoDB ObjectId
 *
 * @route   GET /api/products/:id
 * @access  Public
 * @param   {String} id - Product MongoDB ObjectId
 * @returns {JSON} Single product object with success flag
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid product ID format');
      error.statusCode = 400;
      throw error;
    }

    // Find product and populate category details
    const product = await Product.findById(id).populate('category', 'name slug description');

    // Handle product not found
    if (!product) {
      const error = new Error(`Product with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single product by slug
 * Useful for SEO-friendly URLs and frontend navigation
 *
 * @route   GET /api/products/slug/:slug
 * @access  Public
 * @param   {String} slug - Product URL-friendly slug
 * @returns {JSON} Single product object with success flag
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Validate slug parameter
    if (!slug || slug.trim().length === 0) {
      const error = new Error('Slug parameter is required');
      error.statusCode = 400;
      throw error;
    }

    // Find product by slug and populate category details
    const product = await Product.findOne({ slug: slug.toLowerCase() }).populate(
      'category',
      'name slug description'
    );

    // Handle product not found
    if (!product) {
      const error = new Error(`Product with slug "${slug}" not found`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get products by category with filtering options
 * Convenience endpoint for category-specific product browsing
 *
 * @route   GET /api/products/category/:categoryId
 * @access  Public
 * @param   {String} categoryId - Category MongoDB ObjectId
 * @query   {String} sort - Sort by field
 * @query   {Number} limit - Limit results
 * @returns {JSON} Array of products in category
 */
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { sort, limit } = req.query;

    // Validate category ID format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      const error = new Error('Invalid category ID format');
      error.statusCode = 400;
      throw error;
    }

    // Determine sorting
    let sortOption = { createdAt: -1 };
    if (sort) {
      const sortBy = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      const allowedSortFields = ['price', 'name', 'createdAt', 'stock'];
      if (allowedSortFields.includes(sortBy)) {
        sortOption = { [sortBy]: sortOrder };
      }
    }

    // Determine limit
    let limitValue = 20;
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limitValue = Math.min(parsedLimit, 100);
      }
    }

    // Fetch products for category
    const products = await Product.find({ category: categoryId })
      .sort(sortOption)
      .limit(limitValue)
      .lean();

    const totalCount = await Product.countDocuments({ category: categoryId });

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalCount,
      limit: limitValue,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search products with advanced filtering
 * Full-text search across multiple fields
 *
 * @route   GET /api/products/search/advanced
 * @access  Public
 * @query   {String} q - Search query
 * @query   {Number} minPrice - Minimum price filter
 * @query   {Number} maxPrice - Maximum price filter
 * @query   {String} category - Category ObjectId filter
 * @returns {JSON} Array of matching products
 */
export const searchProducts = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, category } = req.query;

    // Initialize filter
    let filter = {};

    // Text search
    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min) && min >= 0) {
          filter.price.$gte = min;
        }
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max) && max >= 0) {
          filter.price.$lte = max;
        }
      }
    }

    // Category filter
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    // Execute search with text score for relevance
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
