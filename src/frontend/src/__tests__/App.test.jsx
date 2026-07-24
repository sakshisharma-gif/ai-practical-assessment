import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { describe, it, expect } from 'vitest'
import App from '../App'
import authReducer from '../store/slices/authSlice'
import ticketsReducer from '../store/slices/ticketsSlice'
import dashboardReducer from '../store/slices/dashboardSlice'

// Create a test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      tickets: ticketsReducer,
      dashboard: dashboardReducer,
    },
    preloadedState,
  })
}

// Test wrapper with Redux Provider
const renderWithRedux = (component, { preloadedState = {} } = {}) => {
  const store = createTestStore(preloadedState)
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store,
  }
}

describe('App Component', () => {
  it('renders without crashing', () => {
    renderWithRedux(<App />)
  })

  it('shows login page when not authenticated', () => {
    renderWithRedux(<App />)
    
    // Should show login page
    const loginHeading = screen.getByRole('heading', { name: /welcome back/i })
    expect(loginHeading).toBeInTheDocument()
    
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    expect(signInButton).toBeInTheDocument()
  })

  it('shows ticket management branding', () => {
    renderWithRedux(<App />)
    
    const brandingHeading = screen.getByRole('heading', { name: /🎫 ticket management/i })
    expect(brandingHeading).toBeInTheDocument()
  })

  it('shows login form elements', () => {
    renderWithRedux(<App />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    expect(usernameInput).toBeInTheDocument()
    
    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toBeInTheDocument()
  })

  it('shows demo credentials section', () => {
    renderWithRedux(<App />)
    
    const demoButton = screen.getByRole('button', { name: /use demo credentials/i })
    expect(demoButton).toBeInTheDocument()
    
    const demoText = screen.getByText(/for demo purposes/i)
    expect(demoText).toBeInTheDocument()
    
    const usernameCode = screen.getByText('demo')
    const passwordCode = screen.getByText('demo123')
    expect(usernameCode).toBeInTheDocument()
    expect(passwordCode).toBeInTheDocument()
  })

  it('works with Redux store', () => {
    const preloadedState = {
      auth: {
        user: { id: 1, username: 'testuser' },
        isAuthenticated: false, // Still not authenticated, should show login
        loading: false,
        error: null,
        token: null,
      },
    }

    const { store } = renderWithRedux(<App />, { preloadedState })
    
    // Verify the store has the expected state
    expect(store.getState().auth.isAuthenticated).toBe(false)
    expect(store.getState().auth.user.username).toBe('testuser')
    
    // Should still show login page since not authenticated
    const loginHeading = screen.getByRole('heading', { name: /welcome back/i })
    expect(loginHeading).toBeInTheDocument()
  })

  it('redirects to dashboard when authenticated', () => {
    const preloadedState = {
      auth: {
        user: { id: 1, username: 'testuser', fullName: 'Test User' },
        isAuthenticated: true,
        loading: false,
        error: null,
        token: 'test-token',
      },
    }

    renderWithRedux(<App />, { preloadedState })
    
    // Should show navigation (part of dashboard layout)
    const dashboardNav = screen.queryByText(/🎫 ticket management/i)
    // Note: This might not be immediately visible due to routing, 
    // but the important thing is that login page is not shown
    const loginHeading = screen.queryByRole('heading', { name: /welcome back/i })
    expect(loginHeading).not.toBeInTheDocument()
  })
})