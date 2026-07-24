import api, { handleApiResponse, handleApiError } from './api'

/**
 * Dashboard service for handling dashboard data and KPI metrics
 */
const dashboardService = {
  /**
   * Get KPI metrics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period (day, week, month, year)
   * @param {string} params.startDate - Start date for custom period
   * @param {string} params.endDate - End date for custom period
   * @returns {Promise<Object>} KPI metrics data
   */
  async getKPIMetrics(params = {}) {
    try {
      const response = await api.get('/dashboard/kpi', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get tickets grouped by priority
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Tickets by priority data
   */
  async getTicketsByPriority(params = {}) {
    try {
      const response = await api.get('/dashboard/tickets/priority', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get tickets grouped by status
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Tickets by status data
   */
  async getTicketsByStatus(params = {}) {
    try {
      const response = await api.get('/dashboard/tickets/status', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get tickets assigned to current user
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of tickets to return
   * @returns {Promise<Object[]>} Assigned tickets
   */
  async getAssignedTickets(params = {}) {
    try {
      const response = await api.get('/dashboard/tickets/assigned', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get recently updated tickets
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of tickets to return
   * @param {number} params.hours - Number of hours back to look
   * @returns {Promise<Object[]>} Recent tickets
   */
  async getRecentTickets(params = {}) {
    try {
      const response = await api.get('/dashboard/tickets/recent', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get ticket activity timeline
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of activities to return
   * @param {string} params.period - Time period
   * @returns {Promise<Object[]>} Activity timeline
   */
  async getActivityTimeline(params = {}) {
    try {
      const response = await api.get('/dashboard/activity', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get team performance metrics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period
   * @returns {Promise<Object>} Team performance data
   */
  async getTeamPerformance(params = {}) {
    try {
      const response = await api.get('/dashboard/team/performance', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get resolution time analytics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period
   * @param {string} params.groupBy - Group by field (priority, assignee, etc.)
   * @returns {Promise<Object>} Resolution time data
   */
  async getResolutionTimeAnalytics(params = {}) {
    try {
      const response = await api.get('/dashboard/analytics/resolution-time', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get ticket creation trends
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period
   * @param {string} params.granularity - Data granularity (hour, day, week, month)
   * @returns {Promise<Object>} Creation trends data
   */
  async getCreationTrends(params = {}) {
    try {
      const response = await api.get('/dashboard/analytics/creation-trends', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get user workload distribution
   * @param {Object} params - Query parameters
   * @returns {Promise<Object[]>} User workload data
   */
  async getUserWorkload(params = {}) {
    try {
      const response = await api.get('/dashboard/users/workload', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get SLA compliance metrics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period
   * @returns {Promise<Object>} SLA compliance data
   */
  async getSLACompliance(params = {}) {
    try {
      const response = await api.get('/dashboard/sla/compliance', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get customer satisfaction metrics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period
   * @returns {Promise<Object>} Customer satisfaction data
   */
  async getCustomerSatisfaction(params = {}) {
    try {
      const response = await api.get('/dashboard/satisfaction', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get dashboard summary data
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Complete dashboard summary
   */
  async getDashboardSummary(params = {}) {
    try {
      const response = await api.get('/dashboard/summary', { params })
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Refresh all dashboard data
   * @returns {Promise<Object>} Refresh confirmation
   */
  async refreshDashboard() {
    try {
      const response = await api.post('/dashboard/refresh')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get dashboard configuration for user
   * @returns {Promise<Object>} Dashboard configuration
   */
  async getDashboardConfig() {
    try {
      const response = await api.get('/dashboard/config')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Update dashboard configuration
   * @param {Object} config - Dashboard configuration
   * @returns {Promise<Object>} Updated configuration
   */
  async updateDashboardConfig(config) {
    try {
      const response = await api.put('/dashboard/config', config)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Export dashboard data
   * @param {Object} params - Export parameters
   * @param {string} params.format - Export format (pdf, csv, xlsx)
   * @param {string[]} params.widgets - Widgets to include
   * @returns {Promise<Blob>} Export file blob
   */
  async exportDashboard(params = {}) {
    try {
      const response = await api.get('/dashboard/export', {
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
}

export default dashboardService