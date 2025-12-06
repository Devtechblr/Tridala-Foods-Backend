/**
 * ============================================
 * ADMIN CATEGORY CONTROLLER
 * ============================================
 * Handles all admin category management operations
 * TODO: Implement full CRUD logic in Step 2
 */

/**
 * Create a new category
 * TODO: Implement category creation with validation
 *
 * @route   POST /api/admin/categories
 * @access  Admin only
 */
export const createCategory = async (req, res, next) => {
  try {
    // TODO: Validate request body
    // TODO: Check if category name already exists
    // TODO: Create category in database
    // TODO: Auto-generate slug
    // TODO: Return created category with 201 status
    res.status(201).json({
      success: true,
      message: 'TODO: Create category logic',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories (admin view)
 * TODO: Implement admin category listing
 *
 * @route   GET /api/admin/categories
 * @access  Admin only
 */
export const getAllAdminCategories = async (req, res, next) => {
  try {
    // TODO: Fetch all categories with pagination
    // TODO: Include product count for each category
    // TODO: Support sorting and filtering
    res.status(200).json({
      success: true,
      message: 'TODO: Get all admin categories logic',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update category by ID
 * TODO: Implement category update
 *
 * @route   PUT /api/admin/categories/:id
 * @access  Admin only
 */
export const updateCategory = async (req, res, next) => {
  try {
    // TODO: Validate category ID
    // TODO: Validate request body
    // TODO: Update category in database
    // TODO: Update slug if name changed
    // TODO: Return updated category
    res.status(200).json({
      success: true,
      message: 'TODO: Update category logic',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete category by ID
 * TODO: Implement category deletion
 *
 * @route   DELETE /api/admin/categories/:id
 * @access  Admin only
 */
export const deleteCategory = async (req, res, next) => {
  try {
    // TODO: Validate category ID
    // TODO: Check if category has products
    // TODO: Handle products in this category (move, cascade delete, etc.)
    // TODO: Delete category from database
    // TODO: Return success message
    res.status(200).json({
      success: true,
      message: 'TODO: Delete category logic',
    });
  } catch (error) {
    next(error);
  }
};
