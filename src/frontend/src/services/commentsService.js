import api, { handleApiResponse, handleApiError } from './api'

/**
 * Comments service for handling ticket comments
 */
const commentsService = {
  /**
   * Get comments for a ticket
   * @param {number} ticketId - Ticket ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.pageSize - Number of items per page
   * @param {string} params.sortOrder - Sort order (asc/desc)
   * @returns {Promise<Object>} Comments list with pagination
   */
  async getComments(ticketId, params = {}) {
    try {
      const response = await api.get(`/tickets/${ticketId}/comments`, { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Add comment to ticket
   * @param {number} ticketId - Ticket ID
   * @param {Object} commentData - Comment data
   * @param {string} commentData.content - Comment content
   * @returns {Promise<Object>} Created comment data
   */
  async addComment(ticketId, commentData) {
    try {
      const response = await api.post(`/tickets/${ticketId}/comments`, commentData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Update comment
   * @param {number} commentId - Comment ID
   * @param {Object} updateData - Update data
   * @param {string} updateData.content - Updated comment content
   * @returns {Promise<Object>} Updated comment data
   */
  async updateComment(commentId, updateData) {
    try {
      const response = await api.put(`/comments/${commentId}`, updateData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Delete comment
   * @param {number} commentId - Comment ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteComment(commentId) {
    try {
      const response = await api.delete(`/comments/${commentId}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get comment by ID
   * @param {number} commentId - Comment ID
   * @returns {Promise<Object>} Comment data
   */
  async getCommentById(commentId) {
    try {
      const response = await api.get(`/comments/${commentId}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Like/unlike a comment
   * @param {number} commentId - Comment ID
   * @returns {Promise<Object>} Updated comment data
   */
  async toggleCommentLike(commentId) {
    try {
      const response = await api.post(`/comments/${commentId}/like`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Flag comment as inappropriate
   * @param {number} commentId - Comment ID
   * @param {string} reason - Flag reason
   * @returns {Promise<Object>} Flag confirmation
   */
  async flagComment(commentId, reason) {
    try {
      const response = await api.post(`/comments/${commentId}/flag`, { reason })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get comment history/edits
   * @param {number} commentId - Comment ID
   * @returns {Promise<Object[]>} Comment edit history
   */
  async getCommentHistory(commentId) {
    try {
      const response = await api.get(`/comments/${commentId}/history`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Search comments within a ticket
   * @param {number} ticketId - Ticket ID
   * @param {string} query - Search query
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Search results
   */
  async searchComments(ticketId, query, params = {}) {
    try {
      const response = await api.get(`/tickets/${ticketId}/comments/search`, {
        params: { q: query, ...params }
      })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get comments by author
   * @param {string} authorId - Author ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Author's comments
   */
  async getCommentsByAuthor(authorId, params = {}) {
    try {
      const response = await api.get(`/users/${authorId}/comments`, { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Bulk delete comments
   * @param {number[]} commentIds - Array of comment IDs
   * @returns {Promise<Object>} Bulk deletion results
   */
  async bulkDeleteComments(commentIds) {
    try {
      const response = await api.delete('/comments/bulk', {
        data: { commentIds }
      })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get recent comments across all tickets
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of comments to return
   * @returns {Promise<Object[]>} Recent comments
   */
  async getRecentComments(params = {}) {
    try {
      const response = await api.get('/comments/recent', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Mark comment as read
   * @param {number} commentId - Comment ID
   * @returns {Promise<Object>} Read confirmation
   */
  async markCommentAsRead(commentId) {
    try {
      const response = await api.post(`/comments/${commentId}/read`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get unread comments count for user
   * @returns {Promise<Object>} Unread count data
   */
  async getUnreadCommentsCount() {
    try {
      const response = await api.get('/comments/unread/count')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },
}

export default commentsService