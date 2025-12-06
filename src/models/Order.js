import mongoose from 'mongoose';

/**
 * Order Schema for Tridala Nutra Foods
 * Represents customer orders in the e-commerce platform
 * Tracks products, pricing, shipping, and order status
 */
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required for order'],
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required for order item'],
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
      },
      image: String,
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod'],
    default: 'cod',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  trackingId: {
    type: String,
    sparse: true,
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Pre-save hook: Update the updatedAt timestamp
 */
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Create and export Order model
 */
const Order = mongoose.model('Order', orderSchema);

export default Order;
