import mongoose from 'mongoose';

/**
 * Category Schema for Tridala Nutra Foods
 * Represents product categories in the e-commerce platform
 */
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters'],
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true, // Allows null values without unique constraint violation
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Pre-save hook: Auto-generate slug from name
 * Converts category name to a URL-friendly format
 * Example: "Vitamin Supplements" -> "vitamin-supplements"
 */
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    // Convert to lowercase, replace spaces with hyphens, remove special characters
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  }
  next();
});

/**
 * Create and export Category model
 */
const Category = mongoose.model('Category', categorySchema);

export default Category;
