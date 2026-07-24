import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import authReducer from '../../store/slices/authSlice'
import ticketsReducer from '../../store/slices/ticketsSlice'
import dashboardReducer from '../../store/slices/dashboardSlice'

/**
 * Create a test store with optional preloaded state
 * @param {Object} preloadedState - Initial state for the store
 * @returns {Object} - Configured store for testing
 */
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      tickets: ticketsReducer,
      dashboard: dashboardReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable for testing
      }),
  })
}

/**
 * Render component with Redux Provider and Router
 * @param {React.Component} component - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.preloadedState - Initial Redux state
 * @param {Object} options.store - Custom store (optional)
 * @returns {Object} - Render result with store
 */
export const renderWithProviders = (
  component,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )

  return {
    store,
    ...render(component, { wrapper: Wrapper, ...renderOptions }),
  }
}

/**
 * Mock user state for testing
 */
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'User',
}

/**
 * Mock authenticated state
 */
export const mockAuthenticatedState = {
  auth: {
    user: mockUser,
    token: 'mock-jwt-token',
    isAuthenticated: true,
    loading: false,
    error: null,
  },
}

/**
 * Mock tickets for testing
 */
export const mockTickets = [
  {
    id: 1,
    title: 'Fix login issue',
    description: 'Users cannot login with valid credentials',
    status: 'Open',
    priority: 'High',
    assignee: 'testuser',
    reporter: 'manager',
    createdDate: '2023-01-01T00:00:00.000Z',
    updatedDate: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Update documentation',
    description: 'API documentation needs updating',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'developer',
    reporter: 'testuser',
    createdDate: '2023-01-02T00:00:00.000Z',
    updatedDate: '2023-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'Database optimization',
    description: 'Slow query performance',
    status: 'Closed',
    priority: 'Critical',
    assignee: 'dba',
    reporter: 'admin',
    createdDate: '2023-01-03T00:00:00.000Z',
    updatedDate: '2023-01-03T00:00:00.000Z',
  },
]

/**
 * Mock tickets state
 */
export const mockTicketsState = {
  tickets: {
    tickets: mockTickets,
    currentTicket: null,
    loading: false,
    error: null,
    filters: {
      status: '',
      priority: '',
      assignee: '',
      search: '',
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalCount: mockTickets.length,
    },
  },
}

/**
 * Mock dashboard KPI metrics
 */
export const mockKPIMetrics = {
  totalTickets: 45,
  openTickets: 12,
  inProgressTickets: 8,
  resolvedTickets: 20,
  closedTickets: 5,
}

/**
 * Mock dashboard state
 */
export const mockDashboardState = {
  dashboard: {
    kpiMetrics: mockKPIMetrics,
    ticketsByPriority: {
      low: 15,
      medium: 18,
      high: 10,
      critical: 2,
    },
    assignedTickets: mockTickets.slice(0, 2),
    recentTickets: mockTickets,
    loading: false,
    error: null,
  },
}

/**
 * Complete mock state for testing
 */
export const mockCompleteState = {
  ...mockAuthenticatedState,
  ...mockTicketsState,
  ...mockDashboardState,
}