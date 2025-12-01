import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * ============================================
 * START SERVER
 * ============================================
 * Initialize database connection and start Express server
 */
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening on specified port
    const server = app.listen(PORT, () => {
      console.log(`\n✓ Server is running on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health\n`);
    });

    /**
     * ============================================
     * GRACEFUL SHUTDOWN
     * ============================================
     * Handle process termination signals (SIGTERM, SIGINT)
     */
    process.on('SIGTERM', () => {
      console.log('\n✓ SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('✓ HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n✓ SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('✓ HTTP server closed');
        process.exit(0);
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();
