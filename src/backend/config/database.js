const mongoose = require('mongoose');

/**
 * Database configuration and connection management
 * Following clean architecture principles for database layer separation
 */

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connectionRetries = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
  }

  /**
   * Connect to MongoDB database
   * @returns {Promise<boolean>} Connection success status
   */
  async connect() {
    try {
      const mongoUri = this.getConnectionString();
      const options = this.getConnectionOptions();

      console.log('🔄 Connecting to MongoDB...');
      console.log(`📍 URI: ${mongoUri.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@')}`);
      
      await mongoose.connect(mongoUri, options);
      
      this.isConnected = true;
      this.connectionRetries = 0;
      
      console.log('✅ MongoDB connected successfully');
      console.log(`📍 Database: ${mongoose.connection.name}`);
      
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      
      // Check if it's a connection refused error (MongoDB not running)
      if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
        console.log('💡 Tip: Make sure MongoDB is installed and running');
        console.log('💡 You can install MongoDB locally or use MongoDB Atlas (cloud)');
      }
      
      if (this.connectionRetries < this.maxRetries) {
        this.connectionRetries++;
        console.log(`🔄 Retrying connection... (${this.connectionRetries}/${this.maxRetries})`);
        
        await this.delay(this.retryDelay);
        return this.connect();
      }
      
      console.error('💥 Max connection retries reached.');
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB database
   * @returns {Promise<void>}
   */
  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.connection.close();
        this.isConnected = false;
        console.log('✅ MongoDB disconnected successfully');
      }
    } catch (error) {
      console.error('❌ MongoDB disconnection error:', error.message);
      throw error;
    }
  }

  /**
   * Get database connection string based on environment
   * @returns {string} MongoDB connection string
   */
  getConnectionString() {
    const environment = process.env.NODE_ENV || 'development';
    
    switch (environment) {
      case 'test':
        return process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ticket_management_test';
      case 'production':
        if (!process.env.MONGODB_URI) {
          throw new Error('MONGODB_URI environment variable is required in production');
        }
        return process.env.MONGODB_URI;
      default:
        return process.env.MONGODB_DEV_URI || 'mongodb://localhost:27017/ticket_management_dev';
    }
  }

  /**
   * Get MongoDB connection options
   * @returns {Object} Mongoose connection options
   */
  getConnectionOptions() {
    return {
      // Connection options for better performance and reliability
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT) || 5000,
      socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT) || 45000,
      
      // Authentication options (if needed)
      ...(process.env.DB_AUTH_SOURCE && { authSource: process.env.DB_AUTH_SOURCE }),
    };
  }

  /**
   * Get current connection status
   * @returns {Object} Connection status information
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections)
    };
  }

  /**
   * Setup connection event listeners
   */
  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📡 Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await this.disconnect();
    });
  }

  /**
   * Utility method for delay/retry logic
   * @param {number} ms Delay in milliseconds
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create singleton instance
const databaseConnection = new DatabaseConnection();

// Setup event listeners
databaseConnection.setupEventListeners();

module.exports = {
  connect: () => databaseConnection.connect(),
  disconnect: () => databaseConnection.disconnect(),
  getConnectionStatus: () => databaseConnection.getConnectionStatus(),
  isConnected: () => databaseConnection.isConnected
};