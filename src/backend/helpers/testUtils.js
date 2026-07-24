const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');

/**
 * Test utilities for Ticket Management System
 * Provides database setup, test data generation, and common test helpers
 */

class TestUtils {
  constructor() {
    this.mongoServer = null;
    this.connection = null;
  }

  /**
   * Set up test database using MongoDB Memory Server
   * @returns {Promise<void>}
   */
  async setupTestDatabase() {
    try {
      // Create MongoDB Memory Server instance
      this.mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'ticket_management_test'
        }
      });

      // Get connection URI
      const uri = this.mongoServer.getUri();
      
      // Connect to the in-memory database
      await mongoose.connect(uri, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      });

      this.connection = mongoose.connection;
      
      console.log('🧪 Test database connected successfully');
      return uri;
    } catch (error) {
      console.error('❌ Test database setup failed:', error);
      throw error;
    }
  }

  /**
   * Clean up test database
   * @returns {Promise<void>}
   */
  async teardownTestDatabase() {
    try {
      if (this.connection) {
        // Drop all collections
        const collections = await this.connection.db.collections();
        for (const collection of collections) {
          await collection.deleteMany({});
        }

        // Close connection
        await mongoose.connection.close();
        this.connection = null;
      }

      if (this.mongoServer) {
        await this.mongoServer.stop();
        this.mongoServer = null;
      }

      console.log('🧪 Test database cleaned up successfully');
    } catch (error) {
      console.error('❌ Test database cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Clear all collections in the test database
   * @returns {Promise<void>}
   */
  async clearDatabase() {
    try {
      if (this.connection) {
        const collections = await this.connection.db.collections();
        for (const collection of collections) {
          await collection.deleteMany({});
        }
      }
    } catch (error) {
      console.error('❌ Database clear failed:', error);
      throw error;
    }
  }

  /**
   * Create test user data
   * @param {Object} overrides - Fields to override default values
   * @returns {Object} Test user data
   */
  createTestUser(overrides = {}) {
    return {
      username: 'testuser',
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'User',
      ...overrides
    };
  }

  /**
   * Create test ticket data
   * @param {Object} overrides - Fields to override default values
   * @returns {Object} Test ticket data
   */
  createTestTicket(overrides = {}) {
    return {
      title: 'Test Ticket',
      description: 'This is a test ticket description',
      status: 'Open',
      priority: 'Medium',
      labels: ['test', 'sample'],
      createdDate: new Date(),
      updatedDate: new Date(),
      ...overrides
    };
  }

  /**
   * Create test comment data
   * @param {Object} overrides - Fields to override default values
   * @returns {Object} Test comment data
   */
  createTestComment(overrides = {}) {
    return {
      content: 'This is a test comment',
      timestamp: new Date(),
      createdDate: new Date(),
      ...overrides
    };
  }

  /**
   * Generate multiple test tickets
   * @param {number} count - Number of tickets to generate
   * @param {Object} baseData - Base data for all tickets
   * @returns {Array} Array of test tickets
   */
  generateTestTickets(count = 5, baseData = {}) {
    return Array.from({ length: count }, (_, index) => 
      this.createTestTicket({
        title: `Test Ticket ${index + 1}`,
        description: `Description for test ticket ${index + 1}`,
        status: ['Open', 'In Progress', 'Resolved', 'Closed'][index % 4],
        priority: ['Low', 'Medium', 'High', 'Critical'][index % 4],
        ...baseData
      })
    );
  }

  /**
   * Make authenticated API request
   * @param {Object} app - Express app instance
   * @param {string} method - HTTP method (get, post, put, delete)
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Supertest response
   */
  async makeAuthenticatedRequest(app, method, url, data = {}, token = null) {
    const req = request(app)[method.toLowerCase()](url);
    
    if (token) {
      req.set('Authorization', `Bearer ${token}`);
    }

    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && data) {
      req.send(data);
    }

    return req;
  }

  /**
   * Wait for a specified amount of time
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise<void>}
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate random string
   * @param {number} length - Length of the string
   * @returns {string} Random string
   */
  generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }

  /**
   * Generate random email
   * @param {string} domain - Email domain (default: test.com)
   * @returns {string} Random email
   */
  generateRandomEmail(domain = 'test.com') {
    const username = this.generateRandomString(8).toLowerCase();
    return `${username}@${domain}`;
  }

  /**
   * Validate MongoDB ObjectId format
   * @param {string} id - ID to validate
   * @returns {boolean} True if valid ObjectId
   */
  isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  /**
   * Create MongoDB ObjectId
   * @returns {string} New ObjectId
   */
  createObjectId() {
    return new mongoose.Types.ObjectId().toString();
  }

  /**
   * Get current database connection status
   * @returns {Object} Connection status information
   */
  getConnectionStatus() {
    return {
      isConnected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port
    };
  }
}

// Create singleton instance
const testUtils = new TestUtils();

module.exports = {
  testUtils,
  TestUtils
};