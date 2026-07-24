/**
 * Global test setup for Ticket Management System Backend
 * Configures test environment, database setup, and global test utilities
 */

const { testUtils } = require('./helpers/testUtils');

// Set test environment
process.env.NODE_ENV = 'test';

// Increase test timeout for database operations
jest.setTimeout(30000);

/**
 * Global setup before all tests
 */
beforeAll(async () => {
  console.log('🧪 Setting up global test environment...');
  
  try {
    // Setup test database
    await testUtils.setupTestDatabase();
    
    console.log('✅ Global test environment setup complete');
  } catch (error) {
    console.error('❌ Global test setup failed:', error);
    throw error;
  }
});

/**
 * Global cleanup after all tests
 */
afterAll(async () => {
  console.log('🧪 Cleaning up global test environment...');
  
  try {
    // Cleanup test database
    await testUtils.teardownTestDatabase();
    
    console.log('✅ Global test environment cleanup complete');
  } catch (error) {
    console.error('❌ Global test cleanup failed:', error);
    throw error;
  }
});

/**
 * Setup before each test
 */
beforeEach(async () => {
  // Clear database before each test to ensure test isolation
  await testUtils.clearDatabase();
});

/**
 * Cleanup after each test
 */
afterEach(async () => {
  // Additional cleanup if needed
  jest.clearAllMocks();
});

// Global test utilities
global.testUtils = testUtils;

// Console configuration for tests
if (process.env.NODE_ENV === 'test') {
  // Suppress console logs during tests unless debugging
  if (!process.env.DEBUG_TESTS) {
    global.console = {
      ...console,
      // Suppress info and debug logs
      log: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      // Keep error and warn for debugging
      warn: console.warn,
      error: console.error
    };
  }
}

// Jest custom matchers
expect.extend({
  /**
   * Check if value is a valid MongoDB ObjectId
   */
  toBeValidObjectId(received) {
    const pass = testUtils.isValidObjectId(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid ObjectId`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid ObjectId`,
        pass: false
      };
    }
  },

  /**
   * Check if response has standard API error format
   */
  toHaveApiErrorFormat(received) {
    const hasRequiredFields = 
      received &&
      typeof received === 'object' &&
      received.hasOwnProperty('status') &&
      received.hasOwnProperty('message') &&
      received.hasOwnProperty('timestamp');

    if (hasRequiredFields) {
      return {
        message: () => `expected response not to have API error format`,
        pass: true
      };
    } else {
      return {
        message: () => `expected response to have API error format with status, message, and timestamp fields`,
        pass: false
      };
    }
  },

  /**
   * Check if response has standard API success format
   */
  toHaveApiSuccessFormat(received) {
    const hasRequiredFields = 
      received &&
      typeof received === 'object' &&
      received.hasOwnProperty('status') &&
      received.status === 'OK';

    if (hasRequiredFields) {
      return {
        message: () => `expected response not to have API success format`,
        pass: true
      };
    } else {
      return {
        message: () => `expected response to have API success format with status: 'OK'`,
        pass: false
      };
    }
  }
});