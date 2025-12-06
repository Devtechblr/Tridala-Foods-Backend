import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * ============================================
 * ADMIN PRODUCT CONTROLLER
 * ============================================
 * Handles all admin product management operations
 * Implements complete CRUD functionality for product administration
 */

/**
 * Create a new product
 * Validates required fields and category existence before creation
 * Automatically generates slug from product name
 *
 * @route   POST /api/admin/products
 * @access  Admin only
 *
 * @param {string} name - Product name (required)
 * @param {number} price - Regular product price (required)
 * @param {string} category - Category ID (required)
 * @param {string} description - Product description (optional)
 * @param {number} salePrice - Discounted price, must be less than price (optional)
 * @param {array} images - Array of image URLs (optional, max 10)
 * @param {string} weightOrSize - Product weight or size (optional)
 * @param {number} stock - Available inventory (optional)
 * @param {array} healthBenefits - Health benefits list (optional, max 15)
 * @param {array} tags - Search tags (optional, max 20)
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, category, description, salePrice, images, weightOrSize, stock, healthBenefits, tags } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required fields',
      });
    }

    // Validate price is a valid positive number
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number',
      });
    }

    // Validate ObjectId format for category
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format',
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Validate salePrice if provided
    if (salePrice && (typeof salePrice !== 'number' || salePrice >= price)) {
      return res.status(400).json({
        success: false,
        message: 'Sale price must be a valid number and less than regular price',
      });
    }

    // Create product object with validated data
    const productData = {
      name: name.trim(),
      price,
      category,
      description: description ? description.trim() : undefined,
      salePrice: salePrice || undefined,
      images: images || [],
      weightOrSize: weightOrSize ? weightOrSize.trim() : undefined,
      stock: stock || 0,
      healthBenefits: healthBenefits || [],
      tags: tags || [],
    };

    // Remove undefined fields
    Object.keys(productData).forEach((key) => productData[key] === undefined && delete productData[key]);

    // Create and save product
    const product = new Product(productData);
    await product.save();

    // Populate category reference
    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message: messages,
      });
    }

    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: 'A product with this name already exists',
      });
    }

    next(error);
  }
};

/**
 * Get all products (admin view with full details)
 * Returns all products sorted by creation date in descending order
 * Includes category information and all product fields
 *
 * @route   GET /api/admin/products
 * @access  Admin only
 *
 * @query {number} page - Page number for pagination (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @query {string} search - Search by product name
 * @query {string} category - Filter by category ID
 * @query {string} sort - Sort field (default: -createdAt)
 */
export const getAllAdminProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, sort = '-createdAt' } = req.query;

    // Parse pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter = {};

    // Search filter - case-insensitive name search
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Category filter
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    // Execute query with filters, pagination, and sorting
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination info
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
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
 * Get single product by ID (admin view with full details)
 * Returns complete product information including category details
 *
 * @route   GET /api/admin/products/:id
 * @access  Admin only
 *
 * @param {string} id - Product ID (MongoDB ObjectId)
 */
export const getAdminProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    // Fetch product with populated category
    const product = await Product.findById(id).populate('category', 'name slug description');

    // Return 404 if product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product by ID
 * Allows updating any product field including name (which updates slug)
 * Validates category existence if category is being updated
 *
 * @route   PUT /api/admin/products/:id
 * @access  Admin only
 *
 * @param {string} id - Product ID (MongoDB ObjectId)
 * @param {object} req.body - Fields to update (all optional)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    // Validate price if being updated
    if (updateData.price !== undefined) {
      if (typeof updateData.price !== 'number' || updateData.price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid positive number',
        });
      }
    }

    // Validate salePrice if being updated
    if (updateData.salePrice !== undefined) {
      if (typeof updateData.salePrice !== 'number' || updateData.salePrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Sale price must be a valid positive number',
        });
      }

      // If updating salePrice, validate it's less than current or updated price
      const product = await Product.findById(id);
      if (product) {
        const priceToCompare = updateData.price !== undefined ? updateData.price : product.price;
        if (updateData.salePrice >= priceToCompare) {
          return res.status(400).json({
            success: false,
            message: 'Sale price must be less than regular price',
          });
        }
      }
    }

    // Validate category if being updated
    if (updateData.category) {
      if (!mongoose.Types.ObjectId.isValid(updateData.category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID format',
        });
      }

      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
    }

    // Trim string fields if present
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    if (updateData.weightOrSize) updateData.weightOrSize = updateData.weightOrSize.trim();

    // Update product and return new document
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    // Return 404 if product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message: messages,
      });
    }

    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: 'A product with this name already exists',
      });
    }

    next(error);
  }
};

/**
 * Delete product by ID
 * Performs hard delete from the database
 * Returns 404 if product doesn't exist
 *
 * @route   DELETE /api/admin/products/:id
 * @access  Admin only
 *
 * @param {string} id - Product ID (MongoDB ObjectId)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    // Delete product from database
    const product = await Product.findByIdAndDelete(id);

    // Return 404 if product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        _id: product._id,
        name: product.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
