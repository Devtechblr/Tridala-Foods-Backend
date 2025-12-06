import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import globalErrorHandler from './middlewares/errorHandler.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Initialize Express application
const app = express();

/**
 * ============================================
 * MIDDLEWARE SETUP
 * ============================================
 */

// Security middleware - sets various HTTP headers
app.use(helmet());

// CORS middleware - allow cross-origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Logging middleware - logs HTTP requests
app.use(morgan('combined'));

// Body parsing middleware - parse JSON payloads
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * ============================================
 * RATE LIMITING (Placeholder)
 * ============================================
 * Uncomment the code below when ready to implement rate limiting
 *
 * import rateLimit from 'express-rate-limit';
 * 
 * const limiter = rateLimit({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 100, // limit each IP to 100 requests per windowMs
 * });
 * app.use('/api/', limiter);
 */

/**
 * ============================================
 * HEALTH CHECK ROUTE
 * ============================================
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * ============================================
 * API ROUTES
 * ============================================
 */
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
// Example: app.use('/api/users', userRoutes);

/**
 * ============================================
 * 404 NOT FOUND HANDLER
 * ============================================
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/**
 * ============================================
 * GLOBAL ERROR HANDLER MIDDLEWARE
 * ============================================
 * Must be mounted AFTER all other routes and middlewares
 */
app.use(globalErrorHandler);

export default app;
