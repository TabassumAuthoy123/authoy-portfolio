const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    // Check if the URI is a placeholder. If yes, start an in-memory MongoDB
    if (!mongoUri || mongoUri.includes('YOUR_USERNAME') || mongoUri.includes('xxxxx')) {
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
