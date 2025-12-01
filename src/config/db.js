import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using Mongoose
 * Logs success/error messages and handles connection gracefully
 *
 * @returns {Promise<void>}
 */
async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    mongoose.connect(mongoURI);

    console.log('✓ MongoDB connected successfully');
    console.log(`  Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    // Exit process on connection failure (prevents server from running without DB)
    process.exit(1);
  }
}

export default connectDB;
