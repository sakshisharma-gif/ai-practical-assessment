import api, { handleApiResponse, handleApiError } from './api'

/**
 * Authentication service for handling login, logout, and token management
 */
const authService = {
  /**
   * Login user with credentials
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - Password
   * @returns {Promise<Object>} User data and token
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email
   * @param {string} userData.password - Password
   * @param {string} userData.fullName - Full name
   * @returns {Promise<Object>} User data and token
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Logout current user
   * @returns {Promise<Object>} Logout confirmation
   */
  async logout() {
    try {
      const response = await api.post('/auth/logout')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Verify current token
   * @returns {Promise<Object>} User data
   */
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New token data
   */
  async refreshToken(refreshToken) {
    try {
      const response = await api.post('/auth/refresh', { refreshToken })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset request confirmation
   */
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.password - New password
   * @returns {Promise<Object>} Reset confirmation
   */
  async resetPassword(resetData) {
    try {
      const response = await api.post('/auth/reset-password', resetData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Change confirmation
   */
  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },
}

export default authService