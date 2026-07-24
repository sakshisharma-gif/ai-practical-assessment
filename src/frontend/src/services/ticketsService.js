import api, { handleApiResponse, handleApiError } from './api'

/**
 * Tickets service for handling ticket CRUD operations
 */
const ticketsService = {
  /**
   * Get all tickets with optional filtering and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.pageSize - Number of items per page
   * @param {string} params.status - Filter by status
   * @param {string} params.priority - Filter by priority
   * @param {string} params.assignee - Filter by assignee
   * @param {string} params.search - Search term
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc/desc)
   * @returns {Promise<Object>} Tickets list with pagination
   */
  async getTickets(params = {}) {
    try {
      const response = await api.get('/tickets', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get ticket by ID
   * @param {number} ticketId - Ticket ID
   * @returns {Promise<Object>} Ticket data
   */
  async getTicketById(ticketId) {
    try {
      const response = await api.get(`/tickets/${ticketId}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Create new ticket
   * @param {Object} ticketData - Ticket data
   * @param {string} ticketData.title - Ticket title
   * @param {string} ticketData.description - Ticket description
   * @param {string} ticketData.priority - Ticket priority
   * @param {string} ticketData.assignee - Assignee username
   * @param {string[]} ticketData.labels - Ticket labels
   * @returns {Promise<Object>} Created ticket data
   */
  async createTicket(ticketData) {
    try {
      const response = await api.post('/tickets', ticketData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Update ticket
   * @param {number} ticketId - Ticket ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated ticket data
   */
  async updateTicket(ticketId, updateData) {
    try {
      const response = await api.put(`/tickets/${ticketId}`, updateData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Delete ticket
   * @param {number} ticketId - Ticket ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteTicket(ticketId) {
    try {
      const response = await api.delete(`/tickets/${ticketId}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Update ticket status
   * @param {number} ticketId - Ticket ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated ticket data
   */
  async updateTicketStatus(ticketId, status) {
    try {
      const response = await api.patch(`/tickets/${ticketId}/status`, { status })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Assign ticket to user
   * @param {number} ticketId - Ticket ID
   * @param {string} assignee - Assignee username
   * @returns {Promise<Object>} Updated ticket data
   */
  async assignTicket(ticketId, assignee) {
    try {
      const response = await api.patch(`/tickets/${ticketId}/assign`, { assignee })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get tickets assigned to current user
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Assigned tickets
   */
  async getAssignedTickets(params = {}) {
    try {
      const response = await api.get('/tickets/assigned', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get tickets reported by current user
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Reported tickets
   */
  async getReportedTickets(params = {}) {
    try {
      const response = await api.get('/tickets/reported', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Search tickets
   * @param {string} query - Search query
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Search results
   */
  async searchTickets(query, params = {}) {
    try {
      const response = await api.get('/tickets/search', {
        params: { q: query, ...params }
      })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get ticket statistics
   * @param {Object} params - Filter parameters
   * @returns {Promise<Object>} Ticket statistics
   */
  async getTicketStats(params = {}) {
    try {
      const response = await api.get('/tickets/stats', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Export tickets to CSV
   * @param {Object} params - Export parameters
   * @returns {Promise<Blob>} CSV file blob
   */
  async exportTickets(params = {}) {
    try {
      const response = await api.get('/tickets/export', {
        params,
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv'
        }
      })
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Bulk update tickets
   * @param {number[]} ticketIds - Array of ticket IDs
   * @param {Object} updateData - Update data to apply
   * @returns {Promise<Object>} Bulk update results
   */
  async bulkUpdateTickets(ticketIds, updateData) {
    try {
      const response = await api.patch('/tickets/bulk', {
        ticketIds,
        updateData
      })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get available assignees
   * @returns {Promise<Object[]>} List of available assignees
   */
  async getAssignees() {
    try {
      const response = await api.get('/tickets/assignees')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },
}

export default ticketsService