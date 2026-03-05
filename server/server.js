const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./seed');
const Admin = require('./models/Admin');

// Load environment variables
dotenv.config(); // Prioritize root .env or platform variables
dotenv.config({ path: '../.env' }); // Fallback for local development

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://adnanmitul.me',
  'https://www.adnanmitul.me',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/leadership', require('./routes/leadership'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    console.log('Database appears empty. Running seed setup...');
    await seedData();
  }

  if (process.env.NODE_ENV !== 'production' || !process.env.MONGO_URI.includes('mongodb.net')) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
});

module.exports = app;
