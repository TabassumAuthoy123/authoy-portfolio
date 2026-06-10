const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;

  // Use Atlas URI from Environment Variables
  if (!mongoUri || mongoUri.includes('YOUR_USERNAME') || mongoUri.includes('xxxxx')) {
    // If we are in production, don't start Memory Server
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MISSING_MONGO_URI: Please set MONGO_URI in your environment settings.');
    }

    console.log('Detected placeholder MONGO_URI. Starting MongoDB Memory Server...');
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    process.env.MONGO_URI = mongoUri;
  }

  // Connection with retry logic
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        heartbeatFrequencyMS: 10000,
      });

      console.log(`═══════════════════════════════════════`);
      console.log(`  ✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`  📊 Database: ${conn.connection.name}`);
      console.log(`  🔗 Pool Size: 10 connections`);
      console.log(`═══════════════════════════════════════`);

      // Connection event listeners for production robustness
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting reconnection...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected successfully.');
      });

      return; // Success — exit the retry loop
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error('All MongoDB connection attempts failed. Exiting.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
