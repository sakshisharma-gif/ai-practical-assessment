import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, {
  setCredentials,
  clearCredentials,
  clearError,
  loginUser,
  logoutUser,
} from '../../store/slices/authSlice'

// Test store setup
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  })
}

describe('Auth Slice', () => {
  let store

  beforeEach(() => {
    store = createTestStore()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth
      expect(state).toEqual({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      })
    })
  })

  describe('reducers', () => {
    it('should set credentials', () => {
      const credentials = {
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
        token: 'test-token',
      }

      store.dispatch(setCredentials(credentials))
      const state = store.getState().auth

      expect(state.user).toEqual(credentials.user)
      expect(state.token).toEqual(credentials.token)
      expect(state.isAuthenticated).toBe(true)
    })

    it('should clear credentials', () => {
      // First set credentials
      const credentials = {
        user: { id: 1, username: 'testuser' },
        token: 'test-token',
      }
      store.dispatch(setCredentials(credentials))

      // Then clear them
      store.dispatch(clearCredentials())
      const state = store.getState().auth

      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should clear error', () => {
      // Manually set an error in state for testing
      const initialState = {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: 'Test error',
      }
      
      store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: { auth: initialState },
      })

      store.dispatch(clearError())
      const state = store.getState().auth

      expect(state.error).toBeNull()
    })
  })

  describe('async thunks', () => {
    it('should handle loginUser.pending', () => {
      store.dispatch(loginUser.pending(''))
      const state = store.getState().auth

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle loginUser.fulfilled', () => {
      const mockResponse = {
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
        token: 'mock-jwt-token',
      }

      store.dispatch(loginUser.fulfilled(mockResponse, ''))
      const state = store.getState().auth

      expect(state.loading).toBe(false)
      expect(state.user).toEqual(mockResponse.user)
      expect(state.token).toEqual(mockResponse.token)
      expect(state.isAuthenticated).toBe(true)
    })

    it('should handle loginUser.rejected', () => {
      const errorMessage = 'Login failed'
      
      store.dispatch(loginUser.rejected(new Error(errorMessage), '', {}, errorMessage))
      const state = store.getState().auth

      expect(state.loading).toBe(false)
      expect(state.error).toBe(errorMessage)
      expect(state.isAuthenticated).toBe(false)
    })

    it('should handle logoutUser.fulfilled', () => {
      // First set some credentials
      store.dispatch(setCredentials({
        user: { id: 1, username: 'testuser' },
        token: 'test-token',
      }))

      // Then logout
      store.dispatch(logoutUser.fulfilled(true, ''))
      const state = store.getState().auth

      expect(state.loading).toBe(false)
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })
})