const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
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
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
