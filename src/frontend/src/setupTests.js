import '@testing-library/jest-dom'

// Mock environment variables for testing
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3000/api',
    VITE_APP_NAME: 'Ticket Management System',
    VITE_NODE_ENV: 'test'
  },
  writable: true
})

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key) => {
      return null
    },
    setItem: (key, value) => {
      // Mock implementation
    },
    removeItem: (key) => {
      // Mock implementation
    },
    clear: () => {
      // Mock implementation
    }
  },
  writable: true
})

// Global test utilities can be added here