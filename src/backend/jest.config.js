/**
 * Jest Configuration for Ticket Management System Backend
 * Configured for Node.js environment with MongoDB Memory Server integration
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
  ],

  // Coverage collection patterns
  collectCoverageFrom: [
    'app.js',
    'server.js',
    'config/**/*.js',
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'middleware/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!jest.config.js',
    '!setupTests.js'
  ],

  // Coverage thresholds (focused on main application files)
  coverageThreshold: {
    './app.js': {
      branches: 45,
      functions: 80,
      lines: 70,
      statements: 70
    }
  },

  // Module file extensions
  moduleFileExtensions: [
    'js',
    'json'
  ],

  // Transform configuration
  transform: {},

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Test timeout (30 seconds for database operations)
  testTimeout: 30000,

  // Global variables
  globals: {
    'NODE_ENV': 'test'
  },

  // Module name mapping for mocks
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },

  // Force exit after tests complete
  forceExit: true,

  // Detect open handles (useful for debugging)
  detectOpenHandles: true
};