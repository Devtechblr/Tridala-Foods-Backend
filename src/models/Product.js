import mongoose from 'mongoose';

/**
 * Product Schema for Tridala Nutra Foods
 * Represents individual products in the e-commerce platform
 * Links to Category model for organization
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
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
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    validate: {
      validator: function (value) {
        // If salePrice exists, it must be less than regular price
        if (value) {
          return value < this.price;
        }
        return true;
      },
      message: 'Sale price must be less than regular price',
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required for product'],
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 10,
      message: 'Maximum 10 images allowed',
    },
  },
  weightOrSize: {
    type: String,
    trim: true,
    maxlength: [50, 'Weight/Size cannot exceed 50 characters'],
    example: '200g, 400g, 1kg, 500ml',
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  healthBenefits: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 15,
      message: 'Maximum 15 health benefits allowed',
    },
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 20,
      message: 'Maximum 20 tags allowed',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Pre-save hook: Auto-generate slug from product name
 * Converts product name to a URL-friendly format
 * Example: "Whey Protein Isolate 5kg" -> "whey-protein-isolate-5kg"
 */
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
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
 * Text Index for full-text search
 * Enables searching across name, tags, and description fields
 */
productSchema.index({ name: 'text', tags: 'text', description: 'text' });

/**
 * Create and export Product model
 */
const Product = mongoose.model('Product', productSchema);

export default Product;
