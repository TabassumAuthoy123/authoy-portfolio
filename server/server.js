const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize'); // Replaced with custom sanitizer for Express 5
const morgan = require('morgan');
const connectDB = require('./config/db');
const seedData = require('./seed');
const Admin = require('./models/Admin');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter, authLimiter, contactLimiter, uploadLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config(); // Prioritize root .env or platform variables
dotenv.config({ path: '../.env' }); // Fallback for local development

const app = express();

// ═══════════════════════════════════════
//   SECURITY MIDDLEWARE
// ═══════════════════════════════════════

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disabled for Cloudinary images
}));

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// NoSQL injection prevention (Express 5 compatible — req.query is read-only)
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        if (key.startsWith('$')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      }
    }
  };
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  next();
});

// ═══════════════════════════════════════
//   CORS CONFIGURATION
// ═══════════════════════════════════════

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://tabassumauthoy.me',
  'https://www.tabassumauthoy.me',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  maxAge: 86400, // Cache preflight for 24h
}));

// ═══════════════════════════════════════
//   BODY PARSING
// ═══════════════════════════════════════

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ═══════════════════════════════════════
//   RATE LIMITING
// ═══════════════════════════════════════

// Apply general rate limit to all API routes
app.use('/api/', apiLimiter);

// ═══════════════════════════════════════
//   ROUTES
// ═══════════════════════════════════════

// Auth routes (with stricter rate limiting)
app.use('/api/auth', authLimiter, require('./routes/auth'));

// Content routes (standard rate limiting from apiLimiter above)
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/leadership', require('./routes/leadership'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/profile', require('./routes/profile'));

// Contact (with spam prevention rate limiting)
app.use('/api/contact', contactLimiter, require('./routes/contact'));

// Uploads (with upload-specific rate limiting)
app.use('/api/upload', uploadLimiter, require('./routes/upload'));

// Settings & Analytics
app.use('/api/settings', require('./routes/settings'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/backup', require('./routes/backup'));
app.use('/api/clients', require('./routes/clients'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

// ═══════════════════════════════════════
//   ERROR HANDLING
// ═══════════════════════════════════════

// 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// ═══════════════════════════════════════
//   SERVER STARTUP
// ═══════════════════════════════════════

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    console.log('Database appears empty. Running seed setup...');
    await seedData();
  }

  const mongoUri = process.env.MONGO_URI;
  if (process.env.NODE_ENV !== 'production' || (mongoUri && !mongoUri.includes('mongodb.net'))) {
    app.listen(PORT, () => {
      console.log(`\n═══════════════════════════════════════`);
      console.log(`  🚀 Server running on port ${PORT}`);
      console.log(`  📊 Admin: http://localhost:${PORT}/api/health`);
      console.log(`  🔒 Security: helmet + rate-limit + sanitize`);
      console.log(`═══════════════════════════════════════\n`);
    });
  }
});

module.exports = app;
